const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['staff', 'public'],
    default: 'public',
  },
  password: {
    type: String,
    required: function() {
      return !this.isGoogleUser;
    },
    minLength: 6,
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  date: {
    type: String,
    default: Date.now,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  favourites: [{ type: mongoose.Schema.Types.ObjectId }],
});

module.exports = mongoose.model('userm', userSchema);