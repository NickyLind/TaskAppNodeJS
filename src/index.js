const express = require('express');
require('./db/mongoose');
//?NOTE we simply require mongoose here since index.js is our root file and we just want the mongoose file to connect to our DB
const User = require('./models/user');

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
  const user = new User(req.body)

  user.save()
    .then(() => {
      res.send(user)
    })
    .catch((e) => {
      res.status(400).send(e)
    })
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});