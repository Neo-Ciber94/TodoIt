import {
  IReadRepository,
  IRepository,
  IWriteRepository,
  PageResult,
  PaginationOptions,
} from "@server/repositories/base/repository";
import { EntityInput, IEntity } from "@server/types";
import { FilterQuery } from "mongoose";
import { ControllerBase } from "./controller.base";
import { AppControllerConfig } from "./types";

export class ReadOnlyAppController<T extends IEntity>
  extends ControllerBase
  implements IReadRepository<T>
{
  constructor(
    protected readonly repository: IRepository<T>,
    config: AppControllerConfig = {}
  ) {
    super(config);
  }

  async findById(id: string): Promise<T | null> {
    const query: FilterQuery<T> = { _id: id } as any;
    this.setSessionData(query);
    const result = await this.repository.findOne(query);
    return result;
  }

  async findOne(query: FilterQuery<T>): Promise<T | null> {
    this.setSessionData(query);
    const result = await this.repository.findOne(query);
    return result;
  }

  async find(query: FilterQuery<T>): Promise<T[]> {
    this.setSessionData(query);
    const result = await this.repository.find(query);
    return result;
  }

  async findWithPagination(
    options: PaginationOptions<T>
  ): Promise<PageResult<T>> {
    options.query = options.query || {};
    this.setSessionData(options.query);
    const result = await this.repository.findWithPagination(options);
    return result;
  }
}

export class AppController<T extends IEntity>
  extends ReadOnlyAppController<T>
  implements IWriteRepository<T>
{
  constructor(repository: IRepository<T>, config: AppControllerConfig = {}) {
    super(repository, config);
  }

  // prettier-ignore
  protected beforeCreate?(entity: EntityInput<T> | EntityInput<T>[]): Promise<void> | void;

  // prettier-ignore
  protected beforeUpdate?(entity: EntityInput<T>): Promise<void> | void;

  // prettier-ignore
  protected beforeDelete?(entity: T): Promise<void> | void;

  create(entity: EntityInput<T>): Promise<T> {
    this.setSessionData(entity);
    this.beforeCreate?.(entity);
    return this.repository.create(entity);
  }

  createMany(entities: EntityInput<T>[]): Promise<T[]> {
    entities.forEach((entity) => this.setSessionData(entity));
    this.beforeCreate?.(entities);
    return this.repository.createMany(entities);
  }

  updateOne(query: FilterQuery<T>, entity: EntityInput<T>): Promise<T> {
    this.setSessionData(query);
    this.beforeUpdate?.(entity);
    return this.repository.updateOne(query, entity);
  }

  deleteOne(query: FilterQuery<T>): Promise<T> {
    this.setSessionData(query);
    return this.repository.deleteOne(query);
  }
}
