const mongoose = require('mongoose');

const Schema = mongoose.Schema;
 
const userSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['charity_worker', 'public_user'],
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true,
    minLength: 6
  },
  date:{
    type: String,
    default: Date.now,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("userm", userSchema);

