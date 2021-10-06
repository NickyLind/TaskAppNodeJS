const { MongoClient, ObjectID } = require('mongodb');


const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

// const id = new ObjectID()
// console.log(id.id.length);
// console.log(id.toHexString().length);

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
  if(error) {
    return console.log(`Unable to connect to database: ${error}`);
  }

  const db = client.db(databaseName);
  
  // db.collection('users').findOne({ _id: new ObjectID("6159242c6f024e66ec23b0af")}, (error, user) => {
  //   if (error) return console.log("Unable to fetch");

  //   console.log(user);
  // });
  // //? findOne takes in 2 required arguments: The first is an object and the second is a callback function

  // db.collection('users').find({ age: 30 }).toArray((error, users) => {
  //   if (error) return console.log('an error occured');

  //   console.log(users);
  // });

  // db.collection('users').find({ age: 30 }).count((error, count) => {
  //   if (error) return console.log('an error has occured');

  //   console.log(count);
  // });

  db.collection('tasks').findOne( { _id: new ObjectID("6159ddbd99981b5728b3b222")}, (error, document) => {
    if (error) return console.log('There was an issue.');

    console.log(document);
  });

  db.collection('tasks').find({ completed: false}).toArray((error, documents) => {
    if (error) return console.log('An error occured');

    console.log(documents);
  });
});
