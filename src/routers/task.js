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
//* limit / skip === GET /tasks?limit=10&skip=0
router.get('/tasks', auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
    //?NOTE if there is a request query for completed, the completed property of our match object we are passing into our populate method for grabbing tasks will be set to 'true' if the query is true, or 'false' if anything else is specified
    //TODO let's update this so only true or false or no query will work (expand if else statement to include false and !req.query.completed and the else to send an error saying that only true or false can be used for the completed query)
    //! everything about the above query worked except that nothing would return for the /tasks route no matter what i tried.
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        //?parse the string given in the query for limit
        skip: parseInt(req.query.skip)
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