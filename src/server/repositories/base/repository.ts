import { IRepository, PageResult, PaginationOptions } from "./repository.base";
import { Model, FilterQuery } from "mongoose";
import { EntityInput, IEntity } from "@server/types";
import { createPagination } from "../utils";

/**
 * A base repository with the basic operations.
 */
export class Repository<T extends IEntity, TModel extends Model<T>>
  implements IRepository<T>
{
  constructor(protected readonly model: TModel) {}

  // prettier-ignore
  findWithPagination(options: PaginationOptions<T> = {}): Promise<PageResult<T>> {
    options.query = options.query || {};
    this.setId(options.query, options.query.id);
    return createPagination(this.model, options);
  }

  async find(query: FilterQuery<T> = {}): Promise<T[]> {
    this.setId(query, query.id);
    return await this.model.find(query);
  }

  async findOne(query: FilterQuery<T> = {}): Promise<T | null> {
    this.setId(query, query.id);
    return await this.model.findOne(query);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async create(entity: EntityInput<T>): Promise<T> {
    return await this.model.create(entity);
  }

  async createMany(entities: EntityInput<T>[]): Promise<T[]> {
    return await this.model.create(entities);
  }

  // prettier-ignore
  async updateOne(query: FilterQuery<T>, entity: EntityInput<T>): Promise<T | null> {
    this.setId(query, query.id);
    const entityToUpdate = await this.model.findOne(query);

    if (!entityToUpdate) {
      return null;
    }

    for (const key in entity) {
      const value = entity[key as keyof Omit<Partial<T>, "id">];

      if (value !== undefined) {
        (entityToUpdate as any)[key] = value;
      }
    }

    await entityToUpdate.save();
    return entityToUpdate;
  }

  async deleteOne(query: FilterQuery<T>): Promise<T | null> {
    this.setId(query, query.id);
    const entityToDelete = await this.model.findOne(query);

    if (!entityToDelete) {
      return null;
    }

    await entityToDelete.remove();
    return entityToDelete;
  }

  private setId(target: any, id?: unknown): void {
    if (id && target) {
      // MongoDb id is represented as `_id` but we are sending it as `id`
      target._id = id;
      delete target.id;
    }
  }
}
