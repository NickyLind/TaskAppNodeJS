const express = require('express');
require('./db/mongoose');
//?NOTE we simply require mongoose here since index.js is our root file and we just want the mongoose file to connect to our DB
const User = require('./models/user');
const Task = require('./models/task');

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

//* User Create Endpoint
app.post('/users', (req, res) => {
  const user = new User(req.body)

  user.save()
    .then(() => {
      res.status(201).send(user)
    })
    .catch((e) => {
      res.status(400).send(e)
    })
});

//* Read Multiple Users
app.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users)
    })
    .catch((e) => {
      res.status(500).send()
    })
});

//* Read Specific User By ID
app.get('/users/:id', (req, res) => {
  // console.log(req.params);
  const _id = req.params.id

  User.findById(_id)
    .then((user) => {
      if(!user) return res.status(404).send();

      res.send(user);
    })
    .catch((e) => {
      res.status(500).send();
    })
});

//* Task Create Endpoint
app.post('/tasks', (req, res) => {
  const task = new Task(req.body)

  task.save()
    .then(() => {
      res.status(201).send(task)
    })
    .catch((e) => {
      res.status(400).send(e)
    })
});

//* Read All Tasks
app.get('/tasks', (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks)
    })
    .catch((e) => {
      res.status(500).send()
    })
});

//* Read Single Task by ID
app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id;

  Task.findById(_id)
    .then((task) => {
      if(!task) return res.status(404).send();

      res.send(task);
    })
    .catch((e) => {
      res.status(500).send();
    })
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});