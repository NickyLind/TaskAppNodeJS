const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }]
  });

//* Generate a token for authorization
//?NOTE methods are available on the intances of the model
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, 'learningnodejs');

  user.tokens = user.tokens.concat({ token })
  await user.save();
  
  return token;
};

//* Find a user by their credentials
//?NOTE static methods are availabile on the model itself
userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ email: username })
  if(!user) throw new Error('Unable to login. Please check username or password.');
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) throw new Error('Unable to login. Please check username or password.')
  return user;
};

//* Hash the plain text password before saving
userSchema.pre('save',async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next()
});


const User = mongoose.model('User', userSchema);


module.exports = User;