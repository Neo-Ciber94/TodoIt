import logger from "@server/logging";
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

  logger.info("Connecting to MongoDB...");

  try {
    await Mongoose.connect(uri);

    // Cache the connection
    connection = Mongoose.connection;

    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);
  }

  return connection;
}
