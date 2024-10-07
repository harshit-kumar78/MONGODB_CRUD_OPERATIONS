const { MongoClient } = require("mongodb");
require("dotenv").config(); //import the env files

async function main() {
  const client = new MongoClient(process.env.MONGO_CLUSTER_URI);
  try {
    //connect to the mongoDB custer
    await client.connect();
    //make db interaction
    await listDatabases(client);
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
    console.log("connection close successfully");
  }
}

//main function call
main().catch(function (err) {
  console.log(err.message);
});

//list all database in the cluster
async function listDatabases(client) {
  const databaseList = await client.db().admin().listDatabases();

  console.log("databases");
  //listing the database name
  databaseList.databases.forEach(function (db) {
    console.log(db.name);
  });
}
