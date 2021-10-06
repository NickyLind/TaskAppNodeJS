const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

const User = mongoose.model('User', {
  name:{
    type: String
  },
  age: {
    type: Number
  }
});

// const me = new User({
//   name: 'Nick',
//   age: 'Bet'
// });

// me
//   .save()
//   .then(() => {console.log(me);})
//   .catch((error) => {console.log(error);});

const Task = mongoose.model('Task', {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
})

const taskWakeUp = new Task({
  description: 'Wake up',
  completed: false
});

taskWakeUp
  .save()
  .then(() => {console.log(taskWakeUp);})
  .catch((error) => {console.log(error);});