import {
  IRepository,
  PageResult,
  PageSorting,
  SortDirection,
} from "./repository";
import { Model, Document, FilterQuery } from "mongoose";

const DEFAULT_MAX_PAGE_SIZE = 10;

export abstract class MongoRepository<
  TEntity extends Document,
  TModel extends Model<TEntity>
> implements IRepository<TEntity, string, FilterQuery<TEntity>>
{
  constructor(protected readonly model: TModel) {}

  async findWithPagination(
    page: number,
    pageSize: number,
    sorting: PageSorting<TEntity> = {},
    query: FilterQuery<TEntity> = {}
  ): Promise<PageResult<TEntity>> {
    page = Math.max(1, page - 1) || 1;
    pageSize = Math.max(DEFAULT_MAX_PAGE_SIZE, pageSize) || DEFAULT_MAX_PAGE_SIZE;

    if (Object.entries(sorting).length === 0) {
      sorting = { _id: SortDirection.Descending };
    }

    const count = await this.model.countDocuments(query);
    const totalPages = Math.ceil(count / pageSize);

    if (page > totalPages) {
      return pageData({
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: count,
        data: [],
      });
    }

    const data = await this.model
      .find(query)
      .sort(sorting)
      .skip(page * pageSize)
      .limit(pageSize);

    return pageData({
      currentPage: page,
      totalPages,
      pageSize,
      totalItems: count,
      data,
    });
  }

  async find(query: FilterQuery<TEntity> = {}): Promise<TEntity[]> {
    return await this.model.find(query);
  }

  async findOne(query: FilterQuery<TEntity> = {}): Promise<TEntity | null> {
    return await this.model.findOne(query);
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
