import { IRepository, PageResult, PaginationOptions } from "./repository.base";
import { Model, FilterQuery, ClientSession } from "mongoose";
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
  findWithPagination(pagination: PaginationOptions<T> = {}): Promise<PageResult<T>> {
    pagination.query = pagination.query || {};
    this.setId(pagination.query, pagination.query.id);
    return createPagination(this.model, pagination);
  }

  async find(
    query: FilterQuery<T> = {},
    session?: ClientSession
  ): Promise<T[]> {
    this.setId(query, query.id);
    return await this.model.find(query, null, { session });
  }

  async findOne(
    query: FilterQuery<T> = {},
    session?: ClientSession
  ): Promise<T | null> {
    this.setId(query, query.id);
    return await this.model.findOne(query, null, { session });
  }

  async findById(id: string, session?: ClientSession): Promise<T | null> {
    return await this.model.findById(id, null, { session });
  }

  async create(entity: EntityInput<T>, session?: ClientSession): Promise<T> {
    const result = await this.model.create([entity], { session });
    return result[0];
  }

  async createMany(
    entities: EntityInput<T>[],
    session?: ClientSession
  ): Promise<T[]> {
    return await this.model.create(entities, { session });
  }

  // prettier-ignore
  async updateOne(query: FilterQuery<T>, entity: EntityInput<T>, session?: ClientSession): Promise<T | null> {
    this.setId(query, query.id);
    const entityToUpdate = await this.model.findOne(query, null, { session });

    if (!entityToUpdate) {
      return null;
    }

    for (const key in entity) {
      const value = entity[key as keyof Omit<Partial<T>, "id">];

      if (value !== undefined) {
        (entityToUpdate as any)[key] = value;
      }
    }

    await entityToUpdate.save({ session });
    return entityToUpdate;
  }

  async deleteOne(
    query: FilterQuery<T>,
    session?: ClientSession
  ): Promise<T | null> {
    this.setId(query, query.id);
    const entityToDelete = await this.model.findOne(query, null, { session });

    if (!entityToDelete) {
      return null;
    }

    await entityToDelete.remove({ session });
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
