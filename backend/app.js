const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
const app = express();
// const session = require('express-session');



//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());

//API Routes

const authRoutes = require('./Routes/authroutes');


//routes
app.get('/home', (req, res)=>{
    res.send("Welcome to The homepage");
})
app.use('/home/auth', authRoutes);



app.listen(5000,()=>{
    console.log(`The port is running on PORT 5000...`)
});
module.exports = app;