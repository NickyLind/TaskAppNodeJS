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
      unique: true,
      //?NOTE 'unique' property means there can only be one email with this name
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

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ email: username })
  
  if(!user) throw new Error('Unable to login. Please check username or password.');

  const isMatch = await bcrypt.compare(password, user.password);
  
  if(!isMatch) throw new Error('Unable to login. Please check username or password.')

  return user;
};
//?NOTE by setting up out custom method on the statics property of our schema, it allows us to have access to it in our model

//* Hash the plain text password before saving
userSchema.pre('save',async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next()
});
//?NOTE here we refactor our model so that we pass in a custom schema instead of an object. With this schema we are able to create some middleware that allows us to check if a user's inputed plain-text password is correct, to validate their login information

const User = mongoose.model('User', userSchema);


module.exports = User;