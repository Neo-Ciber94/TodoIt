import { QueryParamsMapper } from "@server/controllers/types";
import { parseRecord } from "@shared/utils";
import { ArrayUtils } from "@shared/utils/ArrayUtils";
import { ClientSession, FilterQuery, Model } from "mongoose";
import { NextApiRequest } from "next";
import {
  PageResult,
  PageSorting,
  PaginationOptions,
  SortDirection,
} from "./base/repository.base";

export const DEFAULT_MAX_PAGE_SIZE = 10;

export const EMPTY_PAGE_RESULT: PageResult<any> = Object.freeze({
  data: [],
  totalItems: 0,
  currentPage: 0,
  pageSize: 0,
  totalPages: 0,
});

/**
 * Executes a query and returns the paginated result.
 * @param model The model to query.
 * @param pagination The pagination options.
 * @returns A paginated result.
 */
export async function createPagination<TEntity>(
  model: Model<TEntity>,
  pagination: PaginationOptions<TEntity>
): Promise<PageResult<TEntity>> {
  const session = pagination.session;
  const currentPage = Math.max(1, pagination.page || 1);
  const pageSize = Math.max(1, pagination.pageSize || DEFAULT_MAX_PAGE_SIZE);
  const query = pagination.query || {};
  const count = await model.countDocuments(query);
  const totalPages = Math.ceil(count / pageSize);

  let sorting = pagination.sorting || {};

  if (Object.entries(sorting).length === 0) {
    sorting = { _id: SortDirection.Descending };
  }

  // Quick path
  if (currentPage > totalPages) {
    return createPageResult({
      currentPage,
      totalPages,
      pageSize,
      totalItems: count,
      data: [],
    });
  }

  const data = await model
    .find(query, null, { session })
    .sort(sorting)
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
    .exec();

  return createPageResult({
    currentPage,
    totalPages,
    pageSize,
    totalItems: count,
    data,
  });
}

// prettier-ignore
export function createPageResult<T>({ data, pageSize, currentPage, totalPages, totalItems }: PageResult<T>): PageResult<T> {
  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    data,
  };
}

export type BuildPaginationConfig<T> = {
  query?: boolean | QueryParamsMapper<T>;
  search?: boolean;
  searchPropertyName?: string; // default `search`
};

export function buildPaginationOptions<T>(
  req: NextApiRequest,
  config: BuildPaginationConfig<T> = {}
): PaginationOptions<T> {
  // prettier-ignore
  const { page, pageSize, sort, sortAscending, sortDescending, search, ...rest } = req.query;
  const sorting: PageSorting<T> = {};

  if (sort) {
    for (const key of ArrayUtils.getOrArray(sort)) {
      sorting[key as keyof T] = SortDirection.Descending;
    }
  }

  if (sortAscending) {
    for (const key of ArrayUtils.getOrArray(sortAscending)) {
      sorting[key as keyof T] = SortDirection.Ascending;
    }
  }

  if (sortDescending) {
    for (const key of ArrayUtils.getOrArray(sortDescending)) {
      sorting[key as keyof T] = SortDirection.Descending;
    }
  }

  let query: FilterQuery<T> = {};

  // Search
  if (config.search !== false) {
    if (config.search === true && search) {
      const searchPropertyName = config.searchPropertyName || "search"; // TODO: move to const
      const search = req.query[searchPropertyName] as string;
      delete req.query[searchPropertyName];
      query.$text = { $search: String(search) };
    }
  }

  // Query
  if (config.query != null && rest) {
    let mapper: QueryParamsMapper<T>;

    if (config.query === true || typeof config.query !== "function") {
      mapper = parseRecord;
    } else {
      mapper = config.query;
    }

    const queryData = mapper(rest);
    for (const [key, value] of Object.entries(queryData)) {
      (query as any)[key] = value;
    }
  }

  return {
    page: Number(page),
    pageSize: Number(pageSize),
    sorting,
    query,
  };
}

export type TransationOperation<T, TModel extends Model<T>, TResult> = (
  session: ClientSession,
  model: TModel
) => Promise<TResult> | TResult;

/**
 * Executes a mongodb transaction.
 * @param model The model to use.
 * @param f The function to execute.
 * @returns The result of the transation.
 */
export async function runTransation<T, TModel extends Model<T>, TResult>(
  model: TModel,
  f: TransationOperation<T, TModel, TResult>,
  session?: ClientSession
): Promise<TResult> {
  session ||= await model.startSession();
  session.startTransaction();

  try {
    const result = await f(session, model);
    await session.commitTransaction();
    return result;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
}
