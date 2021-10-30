const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(

  {
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

userSchema.pre('save',async function(next) {
  //? we use a standard function declaration so that we have easy access to the 'this' keyword, which in this case is referencing the specific document being created
  const user = this;

  if (user.isModified('password')) {
    //? isModified is a mongoose method thats takes in a field to check if it has been modified
    user.password = await bcrypt.hash(user.password, 8);
  }

  next()
  //? next() is a callback function papssed into middleware so that the middleware knows when to stop executing.
});
//?NOTE here we refactor our model so that we use a custom schema instead. With this schema we are able to create some middleware that allows us to check if a user's inputed plain-text password is correct, to validate their login information

const User = mongoose.model('User', userSchema);


module.exports = User;