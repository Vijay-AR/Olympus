const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = async (req, res) => {
  const form = req.body;
  console.log(form)
  let query = { $or: [{ username: form.username }, { email: form.email }] };
  const existingUserEmail = await User.findOne(query)
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Try using different email or username." });
    }

    const newUser = new User({
      name: form.name,
      email: form.email,
      username: form.username,
      password: form.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log("Error in generating salt:", err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) {
          console.log("Error in hashing password:", err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        newUser.password = hash;
        try {
          await newUser.save();
          return res.status(201).json({ message: 'User registered successfully', newUser });
        } catch (err) {
          console.log("Error in saving user:", err);
          return res.status(500).json({ error: 'Internal server error' });
        }
      });
    });
  };
