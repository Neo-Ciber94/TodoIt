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
    const currentPage = Math.min(1, page - 1) || 1;
    const currentPageSize = Math.min(DEFAULT_MAX_PAGE_SIZE, pageSize) || DEFAULT_MAX_PAGE_SIZE;

    if (Object.entries(sorting).length === 0) {
      sorting = { _id: SortDirection.Ascending };
    }

    const data = await this.model
      .find(query)
      .skip(currentPage * pageSize)
      .limit(currentPageSize)
      .sort(sorting);

    const totalPages = await this.model.countDocuments(query);

    return {
      data,
      currentPage,
      totalPages,
    };
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
