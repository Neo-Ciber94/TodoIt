import { mongodb } from "@lib/db/mongodb/middleware";
import isPromise from "@lib/utils/isPromise";
import morgan from "morgan";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import nc, { ErrorHandler } from "next-connect";
import withRoutes from "./withRoutes";

export type ApiEndpointHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => Promise<T> | T;

export type ApiErrorHandler<T = any> = ErrorHandler<
  NextApiRequest,
  NextApiResponse<T>
>;

export type RouteApiEndpoint<T = any> = Record<string, ApiEndpointHandler<T>>;

export interface ApiEndpointConfig {
  onError?: ApiErrorHandler;
  get?: RouteApiEndpoint;
  post?: RouteApiEndpoint;
  put?: RouteApiEndpoint;
  patch?: RouteApiEndpoint;
  delete?: RouteApiEndpoint;
  options?: RouteApiEndpoint;
  trace?: RouteApiEndpoint;
  head?: RouteApiEndpoint;
  all?: RouteApiEndpoint;
}

type NextConnectRoute = (
  pattern: string,
  handler: NextApiHandler
) => Promise<any> | any;

const API_ENDPOINTS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "trace",
  "head",
  "all",
];

export function withApi(route: string, config: ApiEndpointConfig) {
  validateRoutePath(route);

  const onError = config.onError;
  const router = withRoutes({ attachParams: true, onError });

  for (const key of API_ENDPOINTS) {
    const method = key as keyof Pick<
      ApiEndpointConfig,
      | "get"
      | "post"
      | "put"
      | "delete"
      | "patch"
      | "head"
      | "trace"
      | "options"
      | "all"
    >;

    const endpoints = config[method];

    if (endpoints) {
      for (const pattern in endpoints) {
        const path = `${route}${pattern}`;
        const routeHandler = router[method];
        const apiHandler = endpoints[pattern];
        setupEndpoint(path, routeHandler, apiHandler);
      }
    }
  }

  return router;
}

// prettier-ignore
function setupEndpoint(pattern: string, route: NextConnectRoute, apiHandler: ApiEndpointHandler) {
  validateRoutePath(pattern);

  route(pattern, async (req, res) => {
    let result = apiHandler(req, res);

    if (result === null) {
      res.status(404);
    }

    if (result != null) {
      if (isPromise(result)) {
        result = await result;
      }

      if (typeof result === "object") {
        res.json(result);
      } else {
        res.send(result);
      }
    }

    res.end();
  });
}

function validateRoutePath(path: string) {
  if (!path.startsWith("/")) {
    throw new Error(`Route paths must starts with '/': ${path}`);
  }
}
