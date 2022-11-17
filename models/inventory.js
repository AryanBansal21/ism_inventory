const mongoose = require("mongoose")

const inventorySchema = new mongoose.Schema({
    modelNo: {
        type: String,
        required: true,
        unique : true 
    },
    name:{
        type: String,                                   // eg table , chair , pc etc
        required:true,
    },
    category:{                                            // eg hostel , lab , library etc
        type: String,
        required:true,
    },
    dateOfPurchase: {
        type: String,
        required: true
    },
    inventoryQnt: {
        type: Number,
        required: true
    },
    inventoryRate: {
        type: Number,
        required: true
    }
}, {timestamps: true})
module.exports = mongoose.model("Inventory",inventorySchema)
