const { MongoClient, ObjectID } = require('mongodb');


const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
  if(error) {
    return console.log(`Unable to connect to database: ${error}`);
  }

  const db = client.db(databaseName);
  
  
});
