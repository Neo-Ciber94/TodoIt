import { QueryParamsMapper } from "@server/controllers/types";
import { parseRecord } from "@shared/utils";
import { ArrayUtils } from "@shared/utils/ArrayUtils";
import { FilterQuery, Model } from "mongoose";
import { NextApiRequest } from "next";
import {
  PageResult,
  PaginationOptions,
  SortDirection,
} from "./base/repository";

export const DEFAULT_MAX_PAGE_SIZE = 10;

export const EMPTY_PAGE_RESULT: PageResult<any> = Object.freeze({
  data: [],
  totalItems: 0,
  currentPage: 0,
  pageSize: 0,
  totalPages: 0,
});

export async function createPagination<TEntity>(
  model: Model<TEntity>,
  options: PaginationOptions<TEntity>
): Promise<PageResult<TEntity>> {
  const currentPage = Math.max(1, options.page || 1);
  const pageSize = Math.max(1, options.pageSize || DEFAULT_MAX_PAGE_SIZE);
  const query = options.query || {};
  const count = await model.countDocuments(query);
  const totalPages = Math.ceil(count / pageSize);

  let sorting = options.sorting || {};

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
    .find(query)
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
  const sorting: Record<string, SortDirection> = {};

  if (sort) {
    for (const key of ArrayUtils.getOrArray(sort)) {
      sorting[key] = SortDirection.Descending;
    }
  }

  if (sortAscending) {
    for (const key of ArrayUtils.getOrArray(sortAscending)) {
      sorting[key] = SortDirection.Ascending;
    }
  }

  if (sortDescending) {
    for (const key of ArrayUtils.getOrArray(sortDescending)) {
      sorting[key] = SortDirection.Descending;
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
