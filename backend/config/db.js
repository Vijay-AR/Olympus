const mongoose = require('mongoose');
require('dotenv').config()
const connect = ()=>{
    mongoose.connect(process.env.MongoUrl)
    .then(()=>{
        console.log("Database Connected...")
    })
    .catch((err)=>{
        console.log(err)
    })
}
module.exports = connect;