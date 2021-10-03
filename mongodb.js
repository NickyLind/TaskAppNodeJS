const { MongoClient, ObjectID } = require('mongodb');


const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID()
console.log(id.id.length);
console.log(id.toHexString().length);

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
  if(error) {
    return console.log(`Unable to connect to database: ${error}`);
  }

  // console.log(`Connected correctly!`);
  const db = client.db(databaseName);
  //? takes in the name of the database we are trying to manipulate, and returns a database reference that we save in a variable called db
  // db.collection('users').insertOne({
  //   _id: id,
  //   name: "Stefani",
  //   age: 31
  // }, (error, result) => {
  //   if(error) {
  //     return console.log(`We ran into a fucking problem buddy: ${error}`);
  //   }

  //   console.log(result.ops);
  // });
  //? we call the connect method on the MongoClient in order to set up the connection to our database. Connect takes a few different arguments, the first is the connectionURL. The second argument is an options object(the option we pass in is because the old parser used to parse the url is depricated, so we want to use the new one). The final argument is a callback function that is called when we get connected to the database (async operation). The callback function 

  // db.collection('users').insertMany([
  //   {
  //     name: 'Jen',
  //     age: 28
  //   }, {
  //     name: 'Gunther',
  //     age: 27
  //   }
  // ], (error, result) => {
  //   if(error) {
  //     return console.log(`something fucking happened bro: ${error}`);
  //   }
  //   console.log(result.ops);
  // })

  // db.collection('tasks').insertMany([
  //   {
  //     description: 'wake up alive',
  //     completed: true
  //   }, {
  //     description: 'try not to drown in the shower',
  //     completed: false
  //   }, {
  //     description: 'put shoes on the right feet',
  //     completed: false
  //   }
  // ], (error, result) => {
  //   if(error) return console.log(`There was an error homie: ${error}`);
  //   console.log(result.ops);
  // })


});
