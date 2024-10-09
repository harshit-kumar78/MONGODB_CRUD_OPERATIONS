const { MongoClient } = require("mongodb");
require("dotenv").config(); //import the env files

async function main() {
  //create the mongo client instance
  const client = new MongoClient(process.env.MONGO_CLUSTER_URI);
  try {
    //connect to the mongoDB custer
    await client.connect();
    // read one user
    // await findOneUserByName(client, (userName = ""));
    await findMinimumRuntimeYearAndMostRecentRelease(client, {
      minimumRuntime: 10,
      minimumYear: 2000,
    });
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

//Print an user details with the given name

async function findOneUserByName(client, userName) {
  const result = await client
    .db("sample_mflix")
    .collection("users")
    .findOne({ name: userName });
  if (result) {
    console.log(
      `Found a listing in the collection with the name '${userName}':`
    );
    console.log(result);
  } else {
    console.log(`No listings found with the name '${userName}'`);
  }
}

async function findMinimumRuntimeYearAndMostRecentRelease(
  client,
  {
    minimumRuntime = 0,
    minimumYear = 0,
    MaximumNumberOfResults = Number.MAX_SAFE_INTEGER,
  }
) {
  const cursor = await client
    .db("sample_mflix")
    .collection("movies")
    .find({
      runtime: { $gte: minimumRuntime },
      year: { $gte: minimumYear },
    })
    .sort({ released: -1 })
    .limit(5);

  const results = await cursor.toArray();

  if (results.length > 0) {
    console.log(
      `Found listing(s) with at least ${minimumRuntime} runtime and ${minimumYear} year:`
    );
    results.forEach((result, i) => {
      const date = new Date(result.released).toDateString();

      console.log();
      console.log(`${i + 1}. name: ${result.plot}`);
      console.log(`   _id: ${result._id}`);
      console.log(`   runtime: ${result.runtime}`);
      console.log(`   year: ${result.year}`);
      console.log(`   most recent release date: ${date}`);
    });
  } else {
    console.log(
      `No movies found with at least ${minimumRuntime} bedrooms and ${minimumYear} bathrooms`
    );
  }
}
