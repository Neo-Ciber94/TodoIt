import seedTodos from "@lib/models/todos.seed";
import * as Mongoose from "mongoose";

let connection: Mongoose.Connection;

export async function connectMongoDb(): Promise<Mongoose.Connection> {
  // prettier-ignore
  if (connection != null && connection.readyState === Mongoose.ConnectionStates.connected) {

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

    // Run an initialization routine
    await initialize();

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }

  return connection;
}

async function initialize() {
  await seedTodos();
}
