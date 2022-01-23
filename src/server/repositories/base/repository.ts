import { EntityInput, IEntity } from "@server/types";
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
  search?: string;
  query?: FilterQuery<T>;
}

// prettier-ignore
export interface IReadRepository<T extends IEntity> {
  findById(id: string): Promise<T | null>;
  findOne(query: FilterQuery<T>): Promise<T | null>;
  find(query: FilterQuery<T>): Promise<T[]>;
  findWithPagination(options: PaginationOptions<T>): Promise<PageResult<T>>;
}

// prettier-ignore
export interface IWriteRepository<T extends IEntity> {
  create(entity: EntityInput<T>): Promise<T>;
  createMany(entities: EntityInput<T>[]): Promise<T[]>;
  updateOne(query: FilterQuery<T>, update: EntityInput<T>): Promise<T | null>;
  deleteOne(query: FilterQuery<T>): Promise<T | null>;
}

// prettier-ignore
export type IRepository<T extends IEntity> = IReadRepository<T> & IWriteRepository<T>;
