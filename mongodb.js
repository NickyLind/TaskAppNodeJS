const { MongoClient, ObjectID } = require('mongodb');


const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
  if(error) {
    return console.log(`Unable to connect to database: ${error}`);
  }

  const db = client.db(databaseName);
  
  // db.collection('users').updateOne({ 
  //   _id: new ObjectID('6159242c6f024e66ec23b0af')
  // }, {
  //   $inc: {
  //     age: 40
  //   }
  // }).then((result) => {
  //   console.log(result);
  // }).catch((error) => {
  //   console.log(error);
  // })

  db.collection('tasks').updateMany({
    completed: false
  }, {
    $set: {
      completed: true
    }
  }).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
});
