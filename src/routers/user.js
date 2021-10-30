const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

//* User Create Endpoint
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//* User Validation Endpoint
router.post('/users/login', async (req, res) => {
  
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//* Read Multiple Users
router.get('/users/me', auth, async (req, res) => {
//?NOTE we pass in our auth middleware as an argument before our routehandler function
//!NOTE the route handler function won't run unless the middleware calls next() in it's function
  res.send(req.user);
});

//* Read Specific User By ID
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const user = await User.findById(_id);

    if(!user) return res.status(404).send();

    res.send(user);
  } catch (error) {
    res.status(500).send(error)
  }
});

//* Update User By ID
router.patch('/users/:id', async (req, res) => {
  const _id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];

  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'There Were Invalid Update Properties In The Request.'});
  }
  try {
    const user = await User.findById(_id);

    updates.forEach((update) => user[update] = req.body[update]);

    await user.save();

    if(!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//* Delete User By ID
router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);

    if(!user) return res.status(404).send({"error": 'User not found.'});

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;