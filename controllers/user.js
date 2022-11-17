const User = require("../models/user")
const {validationResult} = require("express-validator")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('express-jwt');

exports.signup = (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }

    const {name,email,password} = req.body

    if ( !email || !password || !name )
    {
        return res.status(400).json({
            error: "Data Incomplete",
        })
    }

    User.findOne({email}, (err, user) => {
        if(user){
            res.status(400).json({
                message: "User Already Exists"
            })
        }

        if(err || !user){
            const otp = Math.floor(((Math.random() * 1000000) + 100000) % 1000000);

            const token = jwt.sign({name: name, email: email, password: password, otpCoded: otp}, process.env.SECRET)

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'a.antsapps@gmail.com',
                    pass: 'rmyqwmhoebnglmds'
                }
            });
            const mailOptions = {
                from: 'a.antsapps@gmail.com',
                to: email,
                subject: 'Verification Email for ISM Inventory ',
                text: `The OTP to verify you registered email id in ISM Inventory is ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.json({
                        error: error
                    })
                }
                if (info) {
                    res.json({
                        message: "Email Sent Successfully please verify to proceed",
                        token: token
                    })
                }
            })
        }
    })

}


exports.verify_email = (req,res) => {
    const {token,otp} = req.body

    if ( !token || !otp )
    {
        return res.status(400).json({
            error: "Data Incomplete",
        })
    }

    if(token){
        jwt.verify(token, process.env.SECRET, function (error, decodedToken) {
            if (error) {
                return res.status(400).json({
                    message: "Invalid Token"
                })
            }

            const {name, email, password, otpCoded} = decodedToken;

            if (otp.toString() === otpCoded.toString()) {
                const user = new User({name, email, password})

                user.save((e, user) => {
                    if (e) {
                        return res.status(400).json({
                            error: "User Already Exists Please Login to Continue",
                            e
                        })
                    }

                    return res.status(200).json({
                        message: "User Registered Signin to Continue",
                        user
                    })
                })
            }
        })
    }

}


exports.signin = (req, res) => {
    const {email, password} = req.body

    if ( !email || !password )
    {
        return res.status(400).json({
            error: "Data Incomplete",
        })
    }
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "Email was not found"
            })
        }

        // Authenticate user
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password do not match"
            })
        }

        // Create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)

        // Put token in cookie
        res.cookie('token', token, {expire: new Date() + 1})

        // Send response
        const {_id, name, email} = user
        return res.json({
            token,
            user: {
                _id,
                name,
                email
            }
        })

    })
}

exports.signout = (req, res) => {
    res.clearCookie("token")
    return res.json({
        message: "User sign out successful"
    })
}
