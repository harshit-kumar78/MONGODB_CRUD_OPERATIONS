const { MongoClient } = require("mongodb");
require("dotenv").config(); //import the env files

async function main() {
  //create the mongo client instance
  const client = new MongoClient(process.env.MONGO_CLUSTER_URI);
  try {
    //connect to the mongoDB custer
    await client.connect();

    await deleteCommentsByBeforeDate(client, "26-11-22");
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

//find movies based on some condition
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

//update used based on name
async function updateUserByName(client, nameOfUser, updateUser) {
  const result = await client
    .db("sample_mflix")
    .collection("users")
    .updateOne({ name: nameOfUser }, { $set: updateUser });
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

//upsert user by name
async function upsertListingByName(client, nameOfUser, updateUser) {
  const result = await client
    .db("sample_mflix")
    .collection("users")
    .updateOne({ name: nameOfUser }, { $set: updateUser }, { upsert: true });
  console.log(result);
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);

  if (result.upsertedCount > 0) {
    console.log(`One document was inserted with the id ${result.upsertedId}`);
  } else {
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
}
//update all
async function updateAllUsersToHaveRollNumber(client) {
  const result = await client
    .db("sample_mflix")
    .collection("users")
    .updateMany(
      { rollNumber: { $exists: false } },
      { $set: { rollNumber: "Unknown" } }
    );
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}
//delete based on username
async function deleteUserByName(client, userName) {
  const result = await client
    .db("sample_mflix")
    .collection("users")
    .deleteOne({ name: userName });

  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}
// delete based on date
async function deleteCommentsByBeforeDate(client, date) {
  const parts = date.split("-");

  const formattedDate = new Date(
    `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`
  );

  const result = await client
    .db("sample_mflix")
    .collection("comments")
    .deleteMany({ date: { $lte: formattedDate } });

  console.log(result);
}
