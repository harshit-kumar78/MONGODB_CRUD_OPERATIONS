const { MongoClient } = require("mongodb");
require("dotenv").config(); //import the env files

async function main() {
  const client = new MongoClient(process.env.MONGO_CLUSTER_URI);
  try {
    //connect to the mongoDB custer
    await client.connect();
    //make db interaction
    // await listDatabases(client);
    // create a single user
    await createUser(client, {
      name: "Alice3",
      email: "alice@example3.com",
      password: "password123",
    });
    // create multiple user
    await createMultipleUser(client, [
      {
        name: "Alice",
        email: "alice@example.com",
        password: "password123",
      },
      {
        name: "Bob",
        email: "bob@example.com",
        password: "securePassword456",
      },
      {
        name: "Charlie",
        email: "charlie@example.com",
        password: "charliePass789",
      },
    ]);
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

//create new user
async function createUser(client, newUser) {
  if (newUser) {
    const result = await client
      .db("sample_mflix")
      .collection("users")
      .insertOne(newUser);
    console.log(`New user created with the following id: ${result.insertedId}`);
  }
}

//create multiple user
async function createMultipleUser(client, multipleUser) {
  const result = await client
    .db("sample_mflix")
    .collection("users")
    .insertMany(multipleUser);

  console.log(
    `${result.insertedCount} new listing(s) created with the following id(s):`
  );
  console.log(result.insertedIds);
}
