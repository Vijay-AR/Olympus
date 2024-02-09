const mongoose = require('mongoose')
 
const billSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    title:{
       type:String,
    },
    amount:{
        type:Number,
    },
    currency:{
        type:String,
    },
    toWhom:{
        type:String,
        
    },
    recurring:{
        type:String,
    },
    dueDate:{
        type:Date,
    }


},{timestamps: true})

module.exports = mongoose.model("Bill", billSchema)