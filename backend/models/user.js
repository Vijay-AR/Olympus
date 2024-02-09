const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  username:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  friends: {
    type: [String]
  },
  sentRequest:{
    type:[String]
  },
  recievedRequest:{
    type: [String]
  },
  image:{
    type: String,
    default: {}
  },
  inbox:{
    type:[String],
    default: {}
  },
  badges:{
    type:[String]
  },
  friends:{
    type:[String]
  },
  sentRequests:{
    type:[String]
  },
  receivedRequests:{
    type:[String]
},
});

const User = mongoose.model('User', UserSchema);

module.exports = User;