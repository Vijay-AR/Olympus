const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = async(req, res)=>{
    const form = req.body;
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    let errors = req.validationErrors();
    if(errors){
        res.send("Some Parameter is misssing...");
    }
    else{
    let query = {$or: [{username: from.username}, {email: form.email}]};
    await User.findOne(query, function(err, user){
      if(err) {console.log("Error in finding a user in database")}
      let newUser = new User({
        name: form.name,
        email: form.email,
        username: form.username,
        password: form.password
      });     
      if(user){
        res.send('register', {message: req.flash('danger', 'Username AND/OR Email already exists !'), newUser: newUser});
      }
      else {            
        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash(newUser.password, salt, async function(err, hash){
            if(err){
              console.log(err);
              return;
            }
            newUser.password = hash;
            await newUser.save(function(err){
              if(err){
                console.log(err);
                return;
              } else {
                req.flash('success', 'The user : ' + newUser.name + ' is registered and can log in');
                res.redirect('/admin/login');
              }
            });
          });
        });
      } 
    });
}
}