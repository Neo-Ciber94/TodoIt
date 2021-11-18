import {
  IRepository,
  PageResult,
  PaginationOptions,
  SortDirection,
} from "./repository";
import { Model, Document, FilterQuery } from "mongoose";

const DEFAULT_MAX_PAGE_SIZE = 10;

export abstract class MongoRepository<
  TEntity extends Document,
  TModel extends Model<TEntity>
> implements IRepository<TEntity, string>
{
  constructor(protected readonly model: TModel) {}

  async findWithPagination(
    options: PaginationOptions<TEntity> = {}
  ): Promise<PageResult<TEntity>> {
    const currentPage = Math.max(1, options.page || 1);
    const pageSize = Math.max(1, options.pageSize || DEFAULT_MAX_PAGE_SIZE);
    const query = (options.query || {}) as FilterQuery<TEntity>;
    const count = await this.model.countDocuments(query);
    const totalPages = Math.ceil(count / pageSize);

    let sorting = options.sorting || {};

    if (Object.entries(sorting).length === 0) {
      sorting = { _id: SortDirection.Descending };
    }

    // Quick path
    if (currentPage > totalPages) {
      return pageData({
        currentPage,
        totalPages,
        pageSize,
        totalItems: count,
        data: [],
      });
    }

    const data = await this.model
      .find(query)
      .sort(sorting)
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    return pageData({
      currentPage,
      totalPages,
      pageSize,
      totalItems: count,
      data,
    });
  }

  async find(query: Partial<TEntity> = {}): Promise<TEntity[]> {
    const mongodbQuery = query as FilterQuery<TEntity>;
    return await this.model.find(mongodbQuery);
  }

  async findOne(query: Partial<TEntity> = {}): Promise<TEntity | null> {
    const mongodbQuery = query as FilterQuery<TEntity>;
    return await this.model.findOne(mongodbQuery);
  }

  async findById(id: string): Promise<TEntity | null> {
    return await this.model.findById(id);
  }

  async create(entity: Partial<TEntity>): Promise<TEntity> {
    return await this.model.create(entity);
  }

  async update(id: string, entity: Partial<TEntity>): Promise<TEntity> {
    const entityToUpdate = await this.model.findById(id);

    if (!entityToUpdate) {
      throw new Error("Entity not found");
    }

    for (const key in entity) {
      if (entity.hasOwnProperty(key)) {
        const value = (entity as any)[key];

        if (value !== undefined) {
          (entityToUpdate as any)[key] = value;
        }
      }
    }

    return entityToUpdate;
  }

  async delete(id: string): Promise<TEntity> {
    const entityToDelete = await this.model.findById(id);

    if (!entityToDelete) {
      throw new Error("Entity not found");
    }

    await entityToDelete.remove();
    return entityToDelete;
  }
}

// prettier-ignore
function pageData<T>({ data, pageSize, currentPage, totalPages, totalItems }: PageResult<T>): PageResult<T> {
  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    data,
  };
}
