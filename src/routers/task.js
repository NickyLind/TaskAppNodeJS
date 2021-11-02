const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

//* Task Create Endpoint
router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body)
  const task = new Task({
    ...req.body,
    author: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//* Read All Tasks
router.get('/tasks', async (req, res) => {

  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

//* Read Single Task by ID
router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if(!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

//* Update Task By ID
router.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if(!isValidUpdate) {
    return res.status(400).send({error: 'There Were Invalid Update Properties In The Request.'});
  };

  try {
    const task = await Task.findById(_id);

    updates.forEach((update) => task[update] = req.body[update]);

    await task.save();

    if(!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//* Delete Task By ID
router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(_id);

    if(!task) return res.status(404).send({ "error": "Task not found"});

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;