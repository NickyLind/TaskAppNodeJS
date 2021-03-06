const express = require('express');
const auth = require('../middleware/auth');
const sharp = require('sharp');
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

//* Upload User Avatar Middleware
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 100, height: 100})
    .png()
    .toBuffer()

  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
});

//* Delete User Avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//* Fetch User Avatar
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if(!user || !user.avatar) {
      throw new Error('Could not find that user/user avatar');
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(400).send({ error: error.message})
  }
});
module.exports = router;