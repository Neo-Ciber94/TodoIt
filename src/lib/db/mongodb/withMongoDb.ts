import { NextApiRequest, NextApiResponse } from "next";
import * as Mongoose from "mongoose";
import { ConnectionStates } from "mongoose";

type Handler<T, TReturn> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => TReturn;

type AsyncHandler<T, TReturn> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => Promise<TReturn>;

type ApiHandler<T, TReturn> = Handler<T, TReturn> | AsyncHandler<T, TReturn>;

// prettier-ignore
function withMongoDb<T, TReturn>(handler: ApiHandler<T, TReturn>) {
  return async (req: NextApiRequest, res: NextApiResponse<T>) => {
    if (Mongoose.connections.length > 0 && Mongoose.connections[0].readyState === ConnectionStates.connected) {
      return handler(req, res);
    }

    const uri = process.env.MONGO_DB_URI;

    if (uri == null) {
      throw new Error("'MONGO_DB_URI' is not defined");
    }

    console.log("Connecting to MongoDB...");

    try {
      await Mongoose.connect(uri);
      console.log("Connected to MongoDB");
    } 
    catch (error) {
      console.error("Error connecting to MongoDB", error);
    }

    return handler(req, res);
  };
}

export default withMongoDb;