import { IRepository, PageResult } from "@lib/repositories/base/repository";
import { getPagination } from "@lib/repositories/utils";
import { NextApiRequest, NextApiResponse } from "next";
import withRoutes from "./withRoutes";

const DEFAULT_ID_NAME = "id";
const DEFAULT_BASE_PATH = "/api";

type NextApiRequestWithParams = NextApiRequest & {
  params: Record<string, string>;
};

type RestEndpoint<TEntity, TKey, TReturn> = (
  repository: IRepository<TEntity, TKey>,
  req: NextApiRequestWithParams,
  res: NextApiResponse
) => Promise<TReturn>;

export interface CrudConfig<T, TKey> {
  route: string;
  idName?: string;
  baseRoute?: string;
  getAll?: RestEndpoint<T, TKey, PageResult<T>> | null;
  getById?: RestEndpoint<T, TKey, T> | null;
  create?: RestEndpoint<T, TKey, T> | null;
  update?: RestEndpoint<T, TKey, T> | null;
  delete?: RestEndpoint<T, TKey, T> | null;
}

export function withRestApi<
  TEntity,
  TKey,
  TRepository extends IRepository<TEntity, TKey>
>(repository: TRepository, config: CrudConfig<TEntity, TKey>) {
  const basePath = config.baseRoute || DEFAULT_BASE_PATH;

  if (!config.route.startsWith("/")) {
    throw new Error(`Route must starts with '/': ${config.route}`);
  }

  if (!basePath.startsWith("/")) {
    throw new Error(`Base path must starts with '/': ${basePath}`);
  }

  const id = config.idName || DEFAULT_ID_NAME;
  const route = `${basePath}${config.route}`;
  let handler = withRoutes({ attachParams: true });

  // GET - /api/{route}/
  if (config.getAll !== null) {
    const getAll = config.getAll || getAllEndpoint;
    handler.get(route, (req, res) => getAll(repository, req, res));
  }

  // GET - /api/{route}/:id
  if (config.getById !== null) {
    if (config.getById) {
      handler.get(route + `/:${id}`, (req, res) =>
        config.getById!(repository, req, res)
      );
    } else {
      handler.get(route + `/:${id}`, (req, res) =>
        getByIdEndpoint(config, repository, req, res)
      );
    }
  }

  // POST - /api/{route}/
  if (config.create !== null) {
    const create = config.create || createEndpoint;
    handler.post(route, (req, res) => create!(repository, req, res));
  }

  // PUT - /api/{route}/:id
  if (config.update !== null) {
    if (config.update) {
      handler.put(route + `/:${id}`, (req, res) =>
        config.update!(repository, req, res)
      );
    } else {
      handler.put(route + `/:${id}`, (req, res) =>
        updateEndpoint(config, repository, req, res)
      );
    }
  }

  // DELETE - /api/{route}/:id
  if (config.delete !== null) {
    if (config.delete) {
      handler.delete(route + `/:${id}`, (req, res) =>
        config.delete!(repository, req, res)
      );
    } else {
      handler.delete(route + `/:${id}`, (req, res) =>
        deleteEndpoint(config, repository, req, res)
      );
    }
  }

  return handler;
}

async function getAllEndpoint<TEntity, TKey>(
  repository: IRepository<TEntity, TKey>,
  req: NextApiRequestWithParams,
  res: NextApiResponse
) {
  const pagination = getPagination(req);
  const result = await repository.findWithPagination(pagination);
  return res.json(result);
}

async function getByIdEndpoint<TEntity, TKey>(
  config: CrudConfig<TEntity, TKey>,
  repository: IRepository<TEntity, TKey>,
  req: NextApiRequestWithParams,
  res: NextApiResponse
) {
  const keyName = config.idName || DEFAULT_ID_NAME;
  const params = req.params || {};
  const id = params[keyName] as unknown as TKey;
  const result = await repository.findById(id);
  return res.json(result);
}

async function createEndpoint<TEntity, TKey>(
  repository: IRepository<TEntity, TKey>,
  req: NextApiRequestWithParams,
  res: NextApiResponse
) {
  const result = await repository.create(req.body);
  return res.json(result);
}

async function updateEndpoint<TEntity, TKey>(
  config: CrudConfig<TEntity, TKey>,
  repository: IRepository<TEntity, TKey>,
  req: NextApiRequestWithParams,
  res: NextApiResponse
) {
  const keyName = config.idName || DEFAULT_ID_NAME;
  const params = req.params || {};
  const id = params[keyName] as unknown as TKey;
  const entityUpdate = req.body as unknown as TEntity;
  const result = await repository.update(id, entityUpdate);
  return res.json(result);
}

async function deleteEndpoint<TEntity, TKey>(
  config: CrudConfig<TEntity, TKey>,
  repository: IRepository<TEntity, TKey>,
  req: NextApiRequestWithParams,
  res: NextApiResponse
) {
  const keyName = config.idName || DEFAULT_ID_NAME;
  const params = req.params || {};
  const id = params[keyName] as unknown as TKey;
  const result = await repository.delete(id);
  return res.json(result);
}
