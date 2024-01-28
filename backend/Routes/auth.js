// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
require('../config/passport')
const isAuthenticated = require('../config/isauth')

router.post('/login', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    // failureFlash: true 
}));


const registerControl = require('../Controllers/register');
router.post('/register', registerControl);

const logoutControl = require('../Controllers/logout');
const isauth = require('../config/isauth');
router.get('/logout', logoutControl);

router.get('/signout', isAuthenticated,  (req, res, next)=>{
    res.redirect('/auth/login')
})
module.exports = router;


