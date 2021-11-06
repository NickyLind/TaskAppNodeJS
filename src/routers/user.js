const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const multer = require('multer');
const router = new express.Router();

//* User Create Endpoint
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//* User Validation Endpoint (Login)
router.post('/users/login', async (req, res) => {
  
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//* User Logout Endpoint
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send({'message': 'user logged out successfully'});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//* User Logout Of All Sessions
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send({'message': 'all devices have been succesfully logged out of'});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//* Read Multiple Users
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

// //* Read Specific User By ID
// router.get('/users/:id', async (req, res) => {
//   const _id = req.params.id

//   try {
//     const user = await User.findById(_id);

//     if(!user) return res.status(404).send();

//     res.send(user);
//   } catch (error) {
//     res.status(500).send(error)
//   }
// });

//* Update User
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];

  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'There Were Invalid Update Properties In The Request.'});
  }
  try {
    const user = req.user;
    updates.forEach((update) => user[update] = req.body[update]);

    await user.save();

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//* Delete User By ID
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()

    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

//* Upload User Avatar
const upload = multer({
  dest: 'avatars'
});

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
  res.send();
});

module.exports = router;