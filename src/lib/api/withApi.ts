import { connectMongoDb } from "@lib/db/mongodb/connectMongoDb";
import { RestApiConfig, withRestApi } from "@lib/rest-api";
import isPromise from "@lib/utils/isPromise";
import { NextApiHandler } from "next";

export default function withApi(config: RestApiConfig) {
  // Start the mongodb database connection
  connectMongoDb();

  return combileHandlers([
    // Run any middleware before

    // Run the RESTAPI route handler
    withRestApi(config),
  ]);
}

function combileHandlers(handlers: NextApiHandler[]) {
  if (handlers.length === 0) {
    throw new Error("No handlers available");
  }

  return async (req: any, res: any) => {
    for (const handler of handlers) {
      const result = handler(req, res);

      if (isPromise(result)) {
        await result;
      }
    }
  };
}
