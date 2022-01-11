import { FilterQuery } from "mongoose";

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

// prettier-ignore
export interface IReadRepository<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  findOne(query: FilterQuery<TEntity>): Promise<TEntity | null>;
  find(query: FilterQuery<TEntity>): Promise<TEntity[]>;
  findWithPagination(options: PaginationOptions<TEntity>): Promise<PageResult<TEntity>>;
}

// prettier-ignore
export interface IWriteRepository<TEntity> {
  create(entity: Partial<TEntity>): Promise<TEntity>;
  createMany(entities: Partial<TEntity>[]): Promise<TEntity[]>;
  update(entity: Partial<TEntity>): Promise<TEntity>;
  delete(entity: TEntity): Promise<TEntity>;
}

// prettier-ignore
export type IRepository<TEntity> = IReadRepository<TEntity> & IWriteRepository<TEntity>;
