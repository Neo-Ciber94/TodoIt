import { NextApiResponse } from "next";
import path from "path";
import {
  ErrorHandler,
  getMetadataStorage,
  Handler,
  ActionType,
  NextApiRequestWithParams,
  NextHandler,
  ObjectType,
  Middleware,
  RoutePath,
  DEFAULT_CONTROLLER_CONFIG,
  RouteControllerConfig,
  Results,
} from ".";

interface ControllerRoute<Req, Res> {
  path: RoutePath;
  method: ActionType;
  handler: Handler<Req, Res>;
  middlewares: Middleware<Req, Res>[];
}

/**
 * Creates a function from the given controller that handles the requests for this route.
 *
 * @param target The target type to create the route controller.
 * @returns A controller for this route.
 */
export function withController<
  Req extends NextApiRequestWithParams = NextApiRequestWithParams,
  Res extends NextApiResponse = NextApiResponse
>(target: ObjectType<any>) {
  const basePath = getBasePath();
  const controller = new target();
  const controllerRoutes: ControllerRoute<Req, Res>[] = [];
  const metadataStore = getMetadataStorage();
  const actions = metadataStore.getActions(target);
  const allMiddlewares = metadataStore.getMiddlewares(target);
  const controllerMiddlewares = allMiddlewares
    .filter((m) => m.methodName == null)
    .map((m) => m.handler);

  const controllerConfig =
    metadataStore.getController(target)?.config || DEFAULT_CONTROLLER_CONFIG;

  for (const action of actions) {
    const pattern: string | RegExp = action.pattern || "/";

    if (!pattern.toString().startsWith("/")) {
      throw new Error(`Route pattern must start with "/": ${pattern}`);
    }

    const routeMiddlewares = allMiddlewares
      .filter((m) => m.methodName && m.methodName === action.methodName)
      .map((m) => m.handler);

    // prettier-ignore
    const method = controller[action.methodName] as Handler<Req, Res>;
    console.assert(method != null, `Method ${action.methodName} not found`);

    controllerRoutes.push({
      path: new RoutePath(pattern as any), // FIXME: Typescript is not detecting string|RegExp
      method: action.method,
      handler: method.bind(controller),
      middlewares: routeMiddlewares,
    });
  }

  return async function (req: Req, res: Res) {
    let url = req.url || "/";

    if (!url.startsWith(basePath)) {
      return;
    }

    // Slice the base path
    url = url.slice(basePath.length);

    // prettier-ignore
    const errorHandler = metadataStore.getErrorHandler(target) as ErrorHandler<Req, Res> | undefined;
    const onError = errorHandler ?? defaultErrorHandler;
    let done = false;

    // The next action handler
    const next = (err?: any) => {
      done = true;

      if (err) {
        return onError(err, req, res, next);
      }
    };

    // Run the middlewares
    async function runMiddlewares(middlewares: Middleware<Req, Res>[]) {
      for (const middleware of middlewares) {
        await middleware(req, res, next);

        if (!done) {
          return false;
        }
      }

      return true;
    }

    // Run all the middlewares of this controller
    if (!(await runMiddlewares(controllerMiddlewares))) {
      return;
    }

    // Finds the route this request is going to
    const route = findRouteHandler(url, req, controllerRoutes);

    if (route) {
      try {
        // Run this route middlewares
        if (!(await runMiddlewares(route.middlewares))) {
          return;
        }

        return await handleRequest(route, controllerConfig, req, res);
      } catch (err: any) {
        next(err);
      }
    }

    // Not found
    return res.status(404).end();
  };
}

function findRouteHandler(
  url: string,
  req: NextApiRequestWithParams,
  routes: ControllerRoute<any, any>[]
): ControllerRoute<any, any> | null {
  for (const route of routes) {
    const matches = route.path.match(url);

    if ((route.method !== "ALL" && route.method !== req.method) || !matches) {
      continue;
    }

    // Attach params
    req.params = matches;

    return route;
  }

  return null;
}

function getBasePath() {
  const dirname = __dirname.split(path.sep);

  const idx = dirname.indexOf("api");

  if (idx === -1) {
    throw new Error(`Could not find "api/" folder`);
  }

  return "/" + dirname.slice(idx).join("/");
}

async function handleRequest<
  Req extends NextApiRequestWithParams,
  Res extends NextApiResponse
>(
  route: ControllerRoute<Req, Res>,
  config: RouteControllerConfig,
  req: Req,
  res: Res
) {
  const result = await route.handler(req, res);

  // A response was already written
  if (res.writableEnded) {
    return;
  }

  if (result === null) {
    return res.status(config.statusCodeOnNull).end();
  }

  if (result === undefined) {
    return res.status(config.statusCodeOnUndefined).end();
  }

  if (result instanceof Results) {
    return await result.resolve(res);
  }

  if (typeof result === "object" || Array.isArray(result)) {
    return res.json(result);
  }

  return res.send(result);
}

function defaultErrorHandler<
  Req extends NextApiRequestWithParams,
  Res extends NextApiResponse
>(err: any, _: Req, res: Res, next: NextHandler) {
  console.error(err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });

  next();
}
