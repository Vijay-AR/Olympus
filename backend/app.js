const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const session = require('express-session');
const user = require('./user');


//Session and cookies are enables
app.use(express-session({
    resave: false,
    saveUninitialized: false,
    secret:'th1s1sfk1ngs3cr3tk3y'
}))


//setting up passport
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(user.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.serializeUser(user.serializeUser()));
app.use(passport.deserializeUser(user.deserializeUser()));


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//API Routes

const authRoutes = require('./Routes/authroutes');


//routes
app.get('/home', (req, res)=>{
    res.send("Welcome to The homepage");
})
app.use('/home/auth', authRoutes);



app.listen(5000,()=>{
    console.log(`The port is running on PORT 5000...`);
});
module.exports = app;