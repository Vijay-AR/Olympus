const mongoose = require('mongoose')

const transSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    type:{
        type:String,
        required: true
    },
    amount:{
        type:Number,
        trim: true,
        required: true

    },
    currency:{
        type:String,
        required: true

    },
    category:{
        type:String,
        trim: true,
        required: true

    },
    desc:{
        type:String,
        required: true

    },
    date:{
        type: Date,
        trim: true,
        required: true
    },
    
},{timestamps: true}
)

module.exports = mongoose.model("Transaction", transSchema)