import { EntityInput, IEntity } from "@server/types";
import { ClientSession, FilterQuery } from "mongoose";

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
  session?: ClientSession;
}

// prettier-ignore
export interface IReadRepository<T extends IEntity> {
  findById(id: string, session?: ClientSession): Promise<T | null>;
  findOne(query: FilterQuery<T>, session?: ClientSession): Promise<T | null>;
  find(query: FilterQuery<T>, session?: ClientSession): Promise<T[]>;
  findWithPagination(options: PaginationOptions<T>): Promise<PageResult<T>>;
}

// prettier-ignore
export interface IWriteRepository<T extends IEntity> {
  create(entity: EntityInput<T>, session?: ClientSession): Promise<T>;
  createMany(entities: EntityInput<T>[], session?: ClientSession): Promise<T[]>;
  updateOne(query: FilterQuery<T>, update: EntityInput<T>, session?: ClientSession): Promise<T | null>;
  deleteOne(query: FilterQuery<T>, session?: ClientSession): Promise<T | null>;
}

// prettier-ignore
export type IRepository<T extends IEntity> = IReadRepository<T> & IWriteRepository<T>;
