const express = require('express');
const router = express.Router();
const authControllers = require('../Controllers/authController');

//Defining routes
router.get('/register', authControllers.register);
router.get('/login', authControllers.login);


module.exports = router;