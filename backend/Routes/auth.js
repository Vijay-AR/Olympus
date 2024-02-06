const router = require('express').Router();
const passport = require('passport');
require('../config/passport')
const registerControl = require('../Controllers/register');
const isAuthenticated = require('../config/isauth').ensureAuthenticated
const logoutControl = require('../Controllers/logout');




router.post('/login', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true 
}));
router.post('/register', registerControl);
router.post('/logout', logoutControl);
router.get('/signout', isAuthenticated,  (req, res, next)=>{
    res.redirect('/auth/login')
})




module.exports = router;


