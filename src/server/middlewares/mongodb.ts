import { connectMongoDb } from "@server/database/connectMongoDb";
import { NextApiRequest, NextApiResponse } from "next";
import { Middleware } from "next-controllers";

/**
 * A middleware to connect to the MongoDB database.
 * @returns {Middleware} A mongodb connection middleware.
 */
// prettier-ignore
export default function mongoDbMiddleware(): Middleware<NextApiRequest, NextApiResponse> {
  return async (_req, _res, next) => {
    await connectMongoDb();
    next();
  };
}
