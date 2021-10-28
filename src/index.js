const express = require('express');
require('./db/mongoose');
//?NOTE we simply require mongoose here since index.js is our root file and we just want the mongoose file to connect to our DB
const User = require('./models/user');
const Task = require('./models/task');

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

//* User Create Endpoint
app.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//* Read Multiple Users
app.get('/users', async (req, res) => {

  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error)
  }
});

//* Read Specific User By ID
app.get('/users/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const user = await User.findById(_id);

    if(!user) return res.status(404).send();

    res.send(user);
  } catch (error) {
    res.status(500).send(error)
  }
});

//* Task Create Endpoint
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)

  try {
    await task.save()
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//* Read All Tasks
app.get('/tasks', async (req, res) => {

  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

//* Read Single Task by ID
app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if(!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});