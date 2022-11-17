const Inventory = require("../models/inventory");
const { JSONCookie } = require("cookie-parser");
require("express-jwt");

const create = ( req , res ) =>{
    const { modelNo , name , category  , dateOfPurchase , inventoryQnt , inventoryRate } = req.body

    if ( !name || !modelNo || !category || !dateOfPurchase || !inventoryQnt || !inventoryRate  )
    {
        return res.status(400).json({
            error: "Data Incomplete",
        })
    }

    Inventory.findOne( {modelNo} , ( err , inventory ) =>{
        if ( inventory ){
            res.status( 400 ).json({
                message : "Inventory Already Exists"
            })
        }

        if ( err || !inventory ){
            const inventory = new Inventory ({modelNo , name , category , dateOfPurchase , inventoryQnt , inventoryRate })

            inventory.save(( e , inventory ) => {
                if (e) {
                    return res.status(400).json({
                        error: "Error in Saving Data",
                    })
                }

                return res.status(200).json({
                    message: "Inventory saved Successfully",
                    inventory
                })
            })
        }
    })
}

const modify = (req, res) => {

    const { modelNo , name , category , dateOfPurchase , inventoryQnt , inventoryRate } = req.body ;

    if ( !name || !modelNo || !category || !dateOfPurchase || !inventoryQnt || !inventoryRate  )
    {
        return res.status(400).json({
            error: "Data Incomplete",
        })
    }

    Inventory.updateOne(
        { modelNo },{
            $set: {
                name: name,
                modelNo: modelNo,
                category: category,
                dateOfPurchase: dateOfPurchase,
                inventoryQnt: inventoryQnt,
                inventoryRate: inventoryRate,
            },
        },
        (err, response) => {
            if (response) {
                return res.status(200).json({
                    message: "Inventory Updated Successfully",
                    response,
                });
            }

            if (err || !response) {
                res.status(400).json({
                    message: "Inventory Does Not Exists",
                });
            }
        }
    );
};

const delete_response = (req, res) => {
    const { modelNo } = req.body;

    if ( !modelNo ) {
        return res.status(400).json({
            error: "Data Incomplete",
        });
    }
    Inventory.deleteOne({ modelNo }, (err, response) => {
        if (response) {
            return res.status(200).json({
                message: "Inventory Deleted Successfully",
                response,
            });
        }

        if (err || !response) {
            res.status(400).json({
                message: "Inventory Does Not Exists",
            });
        }
    });
};

const response_data = (req, res) => {
    const { modelNo } = req.body;

    if (!modelNo) {
        return res.status(400).json({
            error: "Data Incomplete",
        });
    }
    Inventory.find({ modelNo }, (err, response) => {
        if (response[0]) {
            return res.status(200).json({
                message: "Specific Response",
                response,
            });
        }

        if (err || !response[0]) {
            res.status(400).json({
                message: "No Such Response Exists",
            });
        }
    });
};

const filtered_responses = (req, res) => {
    const { category , name } = req.body;

    if ( category == null || name == null ) {
        return res.status(400).json({
            error: "Data Incomplete",
        });
    }

    Inventory.find({
            category: { $regex: category },
            name: { $regex: name },
        },
        (err, responses) => {
            if (responses[0]) {
                return res.status(200).json({
                    message: "Filtered Responses",
                    responses,
                });
            }

            if (err || !responses[0]) {
                res.status(400).json({
                    message: "No Such Response Exists",
                });
            }
        }
    )
};

module.exports = {
    create: create,
    modify: modify,
    delete: delete_response,
    response_data: response_data,
    filtered_responses: filtered_responses
};
