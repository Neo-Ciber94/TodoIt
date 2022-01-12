import { IRepository, PageResult, PaginationOptions } from "./repository";
import { Model, FilterQuery } from "mongoose";
import { ValidationError } from "@server/utils/errors";
import { IEntityBase } from "@server/types";
import { createPagination, NO_FOUND_ERROR_MESSAGE } from "../utils";

/**
 * An entity with a creator.
 */
export type EntityWithCreator = IEntityBase & { creatorUserId: string };

/**
 * A base repository with the basic operations.
 */
export class Repository<
  TEntity extends IEntityBase,
  TModel extends Model<TEntity>
> implements IRepository<TEntity>
{
  constructor(protected readonly model: TModel) {}

  // prettier-ignore
  findWithPagination(options: PaginationOptions<TEntity> = {}): Promise<PageResult<TEntity>> {
    return createPagination(this.model, options);
  }

  async find(query: FilterQuery<TEntity> = {}): Promise<TEntity[]> {
    return await this.model.find(query);
  }

  async findOne(query: FilterQuery<TEntity> = {}): Promise<TEntity | null> {
    const result = await this.model.findOne(query);
    return result;
  }

  async findById(id: string): Promise<TEntity | null> {
    const result = await this.model.findById(id);
    return result;
  }

  async create(entity: Partial<TEntity>): Promise<TEntity> {
    return await this.model.create(entity);
  }

  async createMany(entities: Partial<TEntity>[]): Promise<TEntity[]> {
    const result = await this.model.create(entities);
    return result;
  }

  async update(entity: Partial<TEntity>): Promise<TEntity> {
    const entityToUpdate = await this.model.findById(entity.id);

    if (!entityToUpdate) {
      throw new ValidationError(NO_FOUND_ERROR_MESSAGE);
    }

    for (const key in entity) {
      const value = entity[key];

      if (value !== undefined) {
        (entityToUpdate as Partial<TEntity>)[key] = value;
      }
    }

    entityToUpdate.save();
    return entityToUpdate;
  }

  async delete(entity: TEntity): Promise<TEntity> {
    const entityToDelete = await this.model.findById(entity.id);

    if (!entityToDelete) {
      throw new ValidationError(NO_FOUND_ERROR_MESSAGE);
    }

    await entityToDelete.remove();
    return entityToDelete;
  }
}

/**
 * A repository whose entities have a creator.
 */
export class RepositoryWithCreator<
  TEntity extends EntityWithCreator,
  TModel extends Model<TEntity>
> extends Repository<TEntity, TModel> {
  async findWithPagination(
    options?: PaginationOptions<TEntity>,
    creatorUserId?: string
  ): Promise<PageResult<TEntity>> {
    options = options || {};
    const query: FilterQuery<TEntity> = options.query || {};
    const result = await createPagination(this.model, {
      ...options,
      query: { ...query, creatorUserId },
    });
    return result;
  }

  override async findById(
    id: string,
    userId?: string
  ): Promise<TEntity | null> {
    if (userId == null) {
      throw new ValidationError("User id is required");
    }

    const result = await this.model.findById(id);

    if (result?.creatorUserId !== userId) {
      return null;
    }

    return result;
  }

  async find(
    query?: FilterQuery<TEntity>,
    userId?: string
  ): Promise<TEntity[]> {
    query = query || {};
    const result = await this.model.find({ ...query, creatorUserId: userId });
    return result;
  }

  async findOne(
    query?: FilterQuery<TEntity>,
    userId?: string
  ): Promise<TEntity | null> {
    query = query || {};
    const result = await this.model.findOne({
      ...query,
      creatorUserId: userId,
    });
    return result;
  }
}
