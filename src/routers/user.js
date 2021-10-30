const express = require('express');
const router = new express.Router();
const User = require('../models/user');

//* User Create Endpoint
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//* Read Multiple Users
router.get('/users', async (req, res) => {

  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error)
  }
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