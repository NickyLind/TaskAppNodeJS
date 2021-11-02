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

// app.use((req, res, next) => {
//   res.status(503).send("This service in currently undergoing maitenence. Please try again in a little while");
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

const Task = require('./models/task');
const User = require('./models/user')

const main = async () => {
  // const task = await Task.findById('6181c3a656f2fa1a55abdf5c');
  // await task.populate('author');
  // console.log(task.author);

  const user = await User.findById('6181c2e27f6bc30eda873ddc');
  await user.populate('tasks');
  console.log(user.tasks);
};

main();