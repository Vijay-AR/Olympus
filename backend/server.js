const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookiesession = require('cookie-session');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport')

//!Configuration 
dotenv.config();
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(cookieParser())
app.use(morgan("common"));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));


//!Session initialized with mongo db and created successfully
const MongoStore = require('connect-mongo');
const sessionStore = new MongoStore({
  mongoUrl : process.env.MongoUrl,
  collection : "session"
})
app.use(session({
  secret: process.env.SessionSecret,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie:{
      maxAge: 1000*60*60*24
  }
}))
app.use(passport.initialize())
app.use(passport.session())


//? Routes 
app.use('/auth', require('./Routes/auth'))
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/transaction', require('./Routes/trans'))
app.use('/savings', require('./Routes/savings'))



//?database connection
const mongo = require('./config/db');
mongo()







//!server initialization
const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});




//! catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



//! error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error2');
});