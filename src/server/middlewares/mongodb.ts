import { connectMongoDb } from "@server/database/connectMongoDb";
import seedTodos from "@server/database/schemas/todos.seed";
import { NextApiRequestWithUser } from "@server/types";
import { NextApiResponse } from "next";
import { Middleware } from "next-controllers";

/**
 * A middleware to connect to the MongoDB database.
 * @returns {Middleware} A mongodb connection middleware.
 */
// prettier-ignore
export default function mongoDbMiddleware(): Middleware<NextApiRequestWithUser, NextApiResponse> {
  return async (req, _res, next) => {
    await connectMongoDb();

    if (req.userId) {
      await seedTodos(req.userId);
    }
    next();
  };
}
