const mongoose = require('mongoose');
const { isEmail } = require('validator');

const User = mongoose.model('User', {
  name:{
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trime: true,
    lowercase: true,
    validate(value){
      if (!isEmail(value)) {
        throw new Error('Email is not valid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error("Password cannot contain the string 'password'.")
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive integer')
      }
    }
  }
});

module.exports = User;