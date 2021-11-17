import {
  IRepository,
  PageResult,
  PageSorting,
  SortDirection,
} from "./repository";
import { Model, Document, FilterQuery } from "mongoose";

export abstract class MongoRepository<
  TEntity extends Document,
  TModel extends Model<TEntity>
> implements IRepository<TEntity, string, FilterQuery<TEntity>>
{
  constructor(protected readonly model: TModel) {}

  async findWithPagination(
    page: number,
    pageSize: number,
    sorting: PageSorting<TEntity> = { _id: SortDirection.Ascending },
    query: FilterQuery<TEntity> = {}
  ): Promise<PageResult<TEntity>> {
    page = Math.min(1, page - 1);
    pageSize = Math.min(10, pageSize);

    const data = await this.model
      .find(query)
      .skip(page * pageSize)
      .limit(pageSize)
      .sort(sorting);

    const totalPages = await this.model.countDocuments(query);

    return {
      data,
      currentPage: page,
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
