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
//* GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const completed = req.query.completed;
  const sort = {};
  
  if(completed === 'true') {
    match.completed = true;
  } else if (completed === 'false') {
    match.completed = false;
  } else if (!completed) {
    delete match.completed;
  } else if (completed !== 'false' || completed !== 'true') {
    res.status(400).send({"Error": "You may only use true or false with the 'completed' query field"})
    return
  }
  
  if(req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }
  
  try {
      await req.user.populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      });
      res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//* Read Single Task by ID
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, author: req.user._id });

    if(!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

//* Update Task By ID
router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if(!isValidUpdate) {
    return res.status(400).send({error: 'There Were Invalid Update Properties In The Request.'});
  };

  try {
    const task = await Task.findOne({ _id, author: req.user._id });
    // const task = await Task.findById(_id);

    
    if(!task) return res.status(404).send();
    updates.forEach((update) => task[update] = req.body[update]);

    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//* Delete Task By ID
router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id, author: req.user._id });

    if(!task) return res.status(404).send({ "error": "Task not found"});

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;