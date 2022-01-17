import * as Mongoose from "mongoose";

let connection: Mongoose.Connection;

/**
 * Connects to the mongodb database.
 * @returns {Promise<Mongoose.Connection>} The connection to the mongodb database.
 */
export async function connectMongoDb(): Promise<Mongoose.Connection> {
  // prettier-ignore
  if (connection != null && connection.readyState === 1) {

    // Returns the cached connection
    return connection;
  }

  const uri = process.env.MONGO_DB_URI;

  if (uri == null) {
    throw new Error("'MONGO_DB_URI' is not defined");
  }

  console.log("Connecting to MongoDB...");

  try {
    await Mongoose.connect(uri);

    // Cache the connection
    connection = Mongoose.connection;

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }

  return connection;
}
