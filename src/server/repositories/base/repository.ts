import { FilterQuery } from "mongoose";

export const EMPTY_PAGE_RESULT: PageResult<any> = Object.freeze({
  data: [],
  totalItems: 0,
  currentPage: 0,
  pageSize: 0,
  totalPages: 0,
});
export interface PageResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export enum SortDirection {
  Ascending = 1,
  Descending = -1,
}

export type PageSorting<T> = {
  [P in keyof T]?: SortDirection;
};

export interface PaginationOptions<T> {
  page?: number;
  pageSize?: number;
  sorting?: PageSorting<T>;
  query?: FilterQuery<T>;
}

export interface IReadRepository<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  findOne(query: FilterQuery<TEntity>): Promise<TEntity | null>;
  find(query: FilterQuery<TEntity>): Promise<TEntity[]>;

  // prettier-ignore
  findWithPagination(options: PaginationOptions<TEntity>): Promise<PageResult<TEntity>>;
}

// prettier-ignore
export interface IWriteRepository<TEntity, TCreate = Partial<TEntity>, TUpdate = Partial<TEntity>> {
  create(entity: TCreate): Promise<TEntity>;
  createMany(entities: TCreate[]): Promise<TEntity[]>;
  update(id: string, entity: TUpdate): Promise<TEntity>;
  partialUpdate(id: string, entity: TUpdate): Promise<TEntity>;
  delete(id: string): Promise<TEntity>;
}

// prettier-ignore
export type IRepository<TEntity> = IReadRepository<TEntity> & IWriteRepository<TEntity>;
