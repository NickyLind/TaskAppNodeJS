require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete("616b39478a0ef30815309590")
  .then(() => {
    return Task.countDocuments({completed: false})
  })
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    console.log(e);
  })