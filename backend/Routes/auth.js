const express = require('express');
const passport = require('passport');
const router = express.Router();
const registerControl = require('../Controllers/register');
require('../config/passport')
const isAuthenticated = require('../config/isauth').ensureAuthenticated
const logoutControl = require('../Controllers/logout');



router.post('/login', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true 
}));

//* Todo: decomment all the comments when the frontend is connected
router.post('/register', registerControl);
router.post('/logout', logoutControl);
router.get('/signout', isAuthenticated, (req, res, next)=>{
    res.status(200).json({"message" : "Signned out succesfully"})
    // res.redirect('/auth/login') 
})




module.exports = router;


