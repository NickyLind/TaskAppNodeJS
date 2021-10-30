const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//   if(req.method === 'GET') {
//     res.send('GET requests are disabled');
//   } else {
//     next();
//   }
// });

app.use((req, res, next) => {
  res.status(503).send("This service in currently undergoing maitenence. Please try again in a little while");
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//*
//* Without Middleware: new request => run route handler
//*
//* With middleware: new request => do something => run route handler
//*

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

const jwt = require('jsonwebtoken');

const myFunction = async () => {
  const token = jwt.sign({ _id: "abc123" }, 'imlearningnodejs', { expiresIn: '7 days' });
  // console.log(token);

  const data = jwt.verify(token, 'imlearningnodejs');
  // console.log(data);
};

myFunction();