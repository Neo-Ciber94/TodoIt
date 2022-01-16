import {
  IRepository,
  PageResult,
  PaginationOptions,
} from "@server/repositories/base/repository";
import { NO_FOUND_ERROR_MESSAGE } from "@server/repositories/utils";
import { FilterQuery } from "mongoose";

export interface IEntity {
  id: string;
}

export interface AppSession {
  userId?: string;
}

const USER_PROP = "creatorUserId";

export class AppService<T extends IEntity> {
  constructor(protected readonly repository: IRepository<T>) {}

  async findWithPagination(
    options: PaginationOptions<T> = {},
    session: AppSession = {}
  ): Promise<PageResult<T>> {
    this.setSessionData(session, options.query);
    const result = await this.repository.findWithPagination(options);
    return result;
  }

  async find(
    query: FilterQuery<T> = {},
    session: AppSession = {}
  ): Promise<T[]> {
    this.setSessionData(session, query);
    const result = await this.repository.find(query);
    return result;
  }

  async findById(id: string, session: AppSession = {}): Promise<T | null> {
    const query: FilterQuery<T> = { _id: id } as any;
    this.setSessionData(session, query);
    const result = await this.repository.findOne(query);
    return result;
  }

  async findOne(
    query: FilterQuery<T> = {},
    session: AppSession = {}
  ): Promise<T | null> {
    this.setSessionData(session, query);
    const result = await this.repository.findOne(query);
    return result;
  }

  async create(entity: Partial<T>, session: AppSession = {}): Promise<T> {
    this.setSessionData(session, entity);
    const result = await this.repository.create(entity);
    return result;
  }

  async createMany(
    entities: Partial<T>[],
    session: AppSession = {}
  ): Promise<T[]> {
    entities.forEach((entity) => this.setSessionData(session, entity));
    const result = await this.repository.createMany(entities);
    return result;
  }

  async update(
    entity: Partial<T> & { id: string },
    session: AppSession = {}
  ): Promise<T> {
    const entityToUpdate = await this.findById(entity.id, session);
    return this.repository.update(entityToUpdate || {});
  }

  async delete(id: string, session: AppSession = {}): Promise<T> {
    const entityToDelete = await this.findById(id, session);

    if (entityToDelete == null) {
      throw new Error(NO_FOUND_ERROR_MESSAGE);
    }

    return this.repository.delete(id);
  }

  private setSessionData(session: AppSession, data: any) {
    if (data == null) {
      return;
    }

    if (session.userId) {
      this.setUser(session.userId, data);
    }
  }

  protected setUser(userId: string, target: any) {
    target[USER_PROP] = userId;
  }
}
