import { NextApiRequest, NextApiResponse } from "next";
import { ApiHandler } from "../typings/handler";
import isPromise from "../utils/isPromise";
import { ValidationError } from "./errors";
import { Logger } from "./logging";

type NextApiHandler = ApiHandler<any, any>;
type VoidApiHandler = ApiHandler<any, void>;
type ErrorHandler = (
  error: any,
  req: NextApiRequest,
  res: NextApiResponse
) => void | Promise<void>;

export interface RestApiConfig {
  get?: NextApiHandler;
  post?: NextApiHandler;
  put?: NextApiHandler;
  patch?: NextApiHandler;
  delete?: NextApiHandler;
  beforeRequest?: VoidApiHandler;
  afterRequest?: VoidApiHandler;
  onError?: ErrorHandler;
  logging?: boolean;
}

export function withRestApi(config: RestApiConfig) {
  if (config.logging == null) {
    config.logging = true;
  }

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
  logIncomingRequest(config, req, handler != null);

  if (handler == null) {
    res.status(404).end();
    return;
  }

  try {
    // Run before the request
    if (config.beforeRequest) {
      await wrapWithPromise(config.beforeRequest(req, res));
    }

    // Result of the handler
    const result: any = await wrapWithPromise(handler(req, res));

    if (result != null) {
      if (typeof result === "object" || Array.isArray(result)) {
        res.json(result);
      } else {
        res.send(result);
      }
    }

    // Run after the request
    if (config.afterRequest) {
      await wrapWithPromise(config.afterRequest(req, res));
    }

    // End the request
    res.end();
  } catch (error: any) {
    // Handle errors
    if (config.logging === true) {
      const message = error.message || error;
      Logger.default.error(message);
    }

    if (config.onError) {
      await wrapWithPromise(config.onError(error, req, res));
    } else {
      defaultOnError(error, req, res);
    }
  } finally {
    logOutcomingRequest(config, req, res, handler != null);
  }
}

function defaultOnError(error: any, _: NextApiRequest, res: NextApiResponse) {
  const message = error.message || error;

  if (error instanceof TypeError) {
    res.status(400).json({ message });
  } else if (error instanceof ValidationError) {
    res.status(400).json({ message });
  } else {
    res.status(500).json({ message });
  }
}

async function wrapWithPromise<T>(value: T) {
  if (isPromise(value)) {
    return await value;
  }

  return value;
}

function logIncomingRequest(
  config: RestApiConfig,
  req: NextApiRequest,
  hasHandler: boolean
) {
  if (config.logging === true) {
    const method = req.method;
    const url = req.url;

    if (hasHandler === true) {
      Logger.default.info(`${method} - ${url}`);
    } else {
      Logger.default.warn(`${method} (404) - ${url}`);
    }
  }
}

function logOutcomingRequest(
  config: RestApiConfig,
  req: NextApiRequest,
  res: NextApiResponse,
  hasHandler: boolean
) {
  if (config.logging === true) {
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;

    if (hasHandler === true) {
      Logger.default.success(`${method} (${status}) - ${url}`);
    } else {
      Logger.default.warn(`${method} (404) - ${url}`);
    }
  }
}
