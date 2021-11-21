import { mongodb } from "@lib/db/mongodb/middleware";
import { IRepository, PageResult } from "@lib/repositories/base/repository";
import { getPagination } from "@lib/repositories/utils";
import isPromise from "@lib/utils/isPromise";
import morgan from "morgan";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorHandler, RequestHandler } from "next-connect";
import withApiRoutes, {
  RouteController,
  NextApiRequestWithParams,
  NextConnectRoute,
} from "./withApiRoutes";

const DEFAULT_BASE_PATH = "/api";
const DEFAULT_ID_NAME = "id";

type RestEndpoint<TEntity, TKey, TReturn> = (
  repository: IRepository<TEntity, TKey>,
  req: NextApiRequestWithParams,
  res: NextApiResponse
) => Promise<TReturn> | TReturn;

type RouteRestEndPoint<T, TKey> = Record<string, RestEndpoint<T, TKey, any>>;

type ApiRouter = (
  path: string,
  handler: RequestHandler<NextApiRequestWithParams, NextApiResponse>
) => Promise<any> | any;

export interface NamingConventions {
  id?: string;
}

export interface RestApiConfig<T, TKey> {
  route: string;
  baseRoute?: string;
  namingConventions?: NamingConventions;
  customEndpoints?: CustomApiEndpoints<T, TKey>;
  onError?: ErrorHandler<NextApiRequest, NextApiResponse>;
  getAll?: RestEndpoint<T, TKey, PageResult<T>> | null;
  getById?: RestEndpoint<T, TKey, T | null> | null;
  create?: RestEndpoint<T, TKey, T> | null;
  update?: RestEndpoint<T, TKey, T> | null;
  delete?: RestEndpoint<T, TKey, T> | null;
}

export interface CustomApiEndpoints<T, TKey> {
  get?: RouteRestEndPoint<T, TKey>;
  post?: RouteRestEndPoint<T, TKey>;
  put?: RouteRestEndPoint<T, TKey>;
  delete?: RouteRestEndPoint<T, TKey>;
  patch?: RouteRestEndPoint<T, TKey>;
  options?: RouteRestEndPoint<T, TKey>;
  trace?: RouteRestEndPoint<T, TKey>;
  head?: RouteRestEndPoint<T, TKey>;
  all?: RouteRestEndPoint<T, TKey>;
}

// prettier-ignore
export function withRestApi<TEntity, TKey>(
  repository: IRepository<TEntity, TKey>,
  config: RestApiConfig<TEntity, TKey>
) {
  config.customEndpoints = config.customEndpoints || {};
  config.namingConventions = config.namingConventions || {};
  config.namingConventions.id = config.namingConventions.id || DEFAULT_ID_NAME;

  const basePath = config.baseRoute || DEFAULT_BASE_PATH;

  validateRoutePath(basePath);
  validateRoutePath(config.route);

  const path = `${basePath}${config.route}`;
  const controller = withApiRoutes<NextApiRequestWithParams, NextApiResponse>({ onError: config.onError })
    .use(mongodb())
    .use(morgan("dev"));

  // Configure custom endpoints
  for (const method in config.customEndpoints) {
    const endpoint = config.customEndpoints[method as keyof CustomApiEndpoints<TEntity, TKey>];

    if (endpoint) {
      for (const route in endpoint) {
        validateRoutePath(route);
        const restEndpoint = endpoint[route as keyof RouteRestEndPoint<TEntity, TKey>];

        if (restEndpoint != null) {
          const onRoute = controller[method as keyof RouteController<any, any>] as NextConnectRoute<any, any>;

          if (onRoute != null) {
            onRoute(`${path}${route}`, (req, res) => restEndpoint(repository, req, res));
          }
        }
      }
    }
  }

  // GetAll
  if (config.getAll !== null) {
    const handler = config.getAll! || getAllEndpoint();
    controller.get(path, (req, res) => handler(repository, req, res));
  }

  // GetById
  if (config.getById !== null) {
    const handler = config.getById! || getByIdEndpoint();
    controller.get(`${path}/:id`, (req, res) => handler(repository, req, res));
  }

  // Create
  if (config.create !== null) {
    const handler = config.create! || createEndpoint(config);
    controller.post(path, (req, res) => handler(repository, req, res));
  }

  // Update
  if (config.update !== null) {
    const handler = config.update! || updateEndpoint();
    controller.put(`${path}/:id`, (req, res) => handler(repository, req, res));
  }

  // Delete
  if (config.delete !== null) {
    const handler = config.delete! || deleteEndpoint();
    controller.delete(`${path}/:id`, (req, res) => handler(repository, req, res));
  }

  return controller;
}

function getAllEndpoint<T, TKey>(): RestEndpoint<T, TKey, void> {
  return async (repo, req, res) => {
    const pagination = getPagination(req);
    const result = await repo.findWithPagination(pagination);
    return res.json(result);
  };
}

function getByIdEndpoint<T, TKey>(): RestEndpoint<T, TKey, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = getEntityId(params.id) as unknown as TKey;
    const result = await repo.findById(id);
    return res.json(result);
  };
}

function createEndpoint<T, TKey>(
  config: RestApiConfig<T, TKey>
): RestEndpoint<T, TKey, void> {
  return async (repo, req, res) => {
    const result = await repo.create(req.body);
    const id = config.namingConventions!.id as keyof T;
    res.setHeader("Location", `${req.url}/${result[id]}`);
    return res.status(201).json(result);
  };
}

function updateEndpoint<T, TKey>(): RestEndpoint<T, TKey, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = getEntityId(params.id) as unknown as TKey;
    const entityUpdate = req.body as unknown as T;
    const result = await repo.update(id, entityUpdate);
    return res.json(result);
  };
}

function deleteEndpoint<T, TKey>(): RestEndpoint<T, TKey, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = getEntityId(params.id) as unknown as TKey;
    const result = await repo.delete(id);
    return res.json(result);
  };
}

function setRouteHandler(
  path: string,
  repository: IRepository<any, any>,
  endpoint: RestEndpoint<any, any, any>,
  router: ApiRouter
) {
  router(path, async (req, res) => {
    let result = endpoint(repository, req, res);

    if (isPromise(result)) {
      result = await result;
    }

    if (result === null) {
      res.status(404);
    }

    if (result != null) {
      if (typeof result === "object") {
        res.status(200).json(result);
      } else {
        res.status(200).send(result);
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

function getEntityId(id: any): string | number | null | undefined {
  if (id == null) {
    return id;
  }

  if (!isNaN(Number(id))) {
    return Number(id);
  }

  return String(id);
}
