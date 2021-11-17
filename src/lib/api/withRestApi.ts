import { NextApiRequest, NextApiResponse } from "next";
import { isPromise } from "util/types";
import { ApiHandler } from "../typings/handler";
import { ValidationError } from "./errors";

export interface RestApiConfig {
  get?: (req: NextApiRequest, res: NextApiResponse) => any;
  post?: (req: NextApiRequest, res: NextApiResponse) => any;
  put?: (req: NextApiRequest, res: NextApiResponse) => any;
  patch?: (req: NextApiRequest, res: NextApiResponse) => any;
  delete?: (req: NextApiRequest, res: NextApiResponse) => any;
  beforeRequest?: (req: NextApiRequest, res: NextApiResponse) => any;
  afterRequest?: (req: NextApiRequest, res: NextApiResponse) => any;
  onError?: (error: any, req: NextApiRequest, res: NextApiResponse) => any;
}

export function withRestApi(config: RestApiConfig) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      return await handleRequest(config, config.get, req, res);
    }

    if (req.method === "POST") {
      return await handleRequest(config, config.post, req, res);
    }

    if (req.method === "PUT") {
      return await handleRequest(config, config.put, req, res);
    }

    if (req.method === "PATCH") {
      return await handleRequest(config, config.patch, req, res);
    }

    if (req.method === "DELETE") {
      return await handleRequest(config, config.delete, req, res);
    }
  };
}

async function handleRequest(
  config: RestApiConfig,
  handler: ApiHandler<any, any> | undefined,
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (handler == null) {
    return;
  }

  try {
    // Run before the request
    if (config.beforeRequest) {
      config.beforeRequest(req, res);
    }

    // Result of the handler
    let result: any;

    if (isPromise(handler)) {
      result = await handler(req, res);
    } else {
      result = handler(req, res);
    }

    if (result != null) {
      if (isPromise(result)) {
        result = await result;
      }

      if (typeof result === "object" || Array.isArray(result)) {
        res.json(result);
      } else {
        res.send(result);
      }
    }

    // Run after the request
    if (config.afterRequest) {
      config.afterRequest(req, res);
    }

    // End the request
    res.end();
  } catch (error) {
    if (config.onError) {
      config.onError(error, req, res);
    } else {
      defaultOnError(error, req, res);
    }
  }
}

function defaultOnError(error: any, _: NextApiRequest, res: NextApiResponse) {
  console.error(error);

  const message = error.message || error;

  if (error instanceof TypeError) {
    res.status(400).json({ message });
  } else if (error instanceof ValidationError) {
    res.status(400).json({ message });
  } else {
    res.status(500).json({ message });
  }
}
