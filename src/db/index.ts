import * as Mongoose from "mongoose";

export module Db {
  let connection: Mongoose.Connection | null;

  export async function connect(): Promise<void> {
    const url = process.env.MONGO_DB_URI;

    if (url == null) {
      throw new Error("Unable to load mongodb url");
    }

    await Mongoose.connect(url);

    connection = Mongoose.connection;

    connection.once("open", async () => {
      console.log("Connected to database");
    });

    connection.on("error", () => {
      console.error("Error connecting to database");
    });
  }

  export async function disconnect(): Promise<void> {
    if (connection == null) {
      throw new Error("Not connected to database");
    }

    await Mongoose.disconnect();
    connection = null;
  }

  export function getConnection(): Mongoose.Connection {
    if (connection == null) {
      throw new Error("Database not connected");
    }

    return connection;
  }
}
