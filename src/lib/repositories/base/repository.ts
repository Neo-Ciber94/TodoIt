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

export interface IReadRepository<TEntity, TKey, TQuery = TEntity> {
  findById(id: TKey): Promise<TEntity | null>;
  findOne(query: TQuery): Promise<TEntity | null>;
  find(query: TQuery): Promise<TEntity[]>;

  findWithPagination(
    page: number,
    pageSize: number,
    sorting: PageSorting<TEntity>,
    query: TQuery
  ): Promise<PageResult<TEntity>>;
}

export interface IWriteRepository<TEntity, TKey> {
  create(entity: Partial<TEntity>): Promise<TEntity>;
  update(id: TKey, entity: Partial<TEntity>): Promise<TEntity>;
  delete(id: TKey): Promise<TEntity>;
}

// prettier-ignore
export type IRepository<TEntity, TKey, TQuery = TEntity> = 
  IReadRepository<TEntity, TKey, TQuery> & 
  IWriteRepository<TEntity, TKey>;
