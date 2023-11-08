const User = require('../user');

// Route for registering a new user
const register = (req, res)=>{
    res.send("This is registring page")
}

// Route for logging in a user
const login = (req, res ) =>{
    res.send("This is logging page")

}

// Route for logging Out a user
const logout = (req, res) =>{}

// Route for Update the user details
const update = (req, res) =>{}



module.exports= {register , login, update, logout}