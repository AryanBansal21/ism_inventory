const express = require("express")
const inventory = require("../controllers/inventory");
const {check} = require("express-validator")
const userAuth = require("../middlewares/userAuth");
const router = express.Router()

router.post("/create", userAuth , inventory.create )

router.post("/modify" , userAuth , inventory.modify )

router.post("/delete", userAuth , inventory.delete )

router.post("/response_data" , inventory.response_data )

router.post("/filtered_responses" , inventory.filtered_responses )

module.exports = router