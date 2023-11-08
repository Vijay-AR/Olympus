const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/usersDB");
const userschema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
const user = mongoose.model("user", userschema);

module.exports = user 

