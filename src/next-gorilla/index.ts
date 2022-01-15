import { FilterQuery, Model } from "mongoose";
import { NextApiRequest } from "next";

export type PartialExcept<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] : T[P];
};

export interface IEntity {
  id: string;
}

export type PageFilterQuery<T> = {
  page: number;
  pageSize: number;
  query?: FilterQuery<T>;
};

export const DEFAULT_PAGE_QUERY: PageFilterQuery<any> = {
  page: 1,
  pageSize: 10,
};

export interface PageResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
}

export interface IReadRepository<T extends IEntity> {
  find(query: FilterQuery<T>): Promise<T[]>;
  findOne(query: FilterQuery<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  findWithPaging(query: PageFilterQuery<T>): Promise<PageResult<T>>;
}

// prettier-ignore
export interface IWriteRepository<T extends IEntity> {
  create(entity: Partial<T>): Promise<T>;
  createMany(entities: Partial<T>[]): Promise<T[]>;
  update(entity: PartialExcept<T, "id">): Promise<T>;
  updateMany(query: FilterQuery<T>, entity:  PartialExcept<T, "id">): Promise<T[]>;
  delete(id: string): Promise<T>;
  deleteMany(query: FilterQuery<T>): Promise<T[]>;
}

// prettier-ignore
export type IRepository<T extends IEntity> = 
    IReadRepository<T> & 
    IWriteRepository<T>;

export class Repository<T extends IEntity, TModel extends Model<T>>
  implements IRepository<T>
{
  constructor(protected readonly model: TModel) {}

  async find(query: FilterQuery<T> = {}): Promise<T[]> {
    const result = await this.model.find(query);
    return result;
  }

  async findOne(query: FilterQuery<T> = {}): Promise<T | null> {
    const result = await this.model.findOne(query);
    return result;
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.model.findById(id);
    return result;
  }

  async findWithPaging(
    pageQuery: PageFilterQuery<T> = DEFAULT_PAGE_QUERY
  ): Promise<PageResult<T>> {
    const { page, pageSize, query = {} } = pageQuery;
    const skip = (page - 1) * pageSize;
    const totalCount = await this.model.countDocuments(query);
    const pageCount = Math.ceil(totalCount / pageSize);

    const data = await this.model.find(query).skip(skip).limit(pageSize).exec();

    return {
      data,
      page,
      pageSize,
      pageCount,
      totalCount,
    };
  }

  async create(entity: Partial<T>): Promise<T> {
    const result = await this.model.create(entity);
    return result;
  }

  async createMany(entities: Partial<T>[]): Promise<T[]> {
    const result = await this.model.create(entities);
    return result;
  }

  async update(entity: PartialExcept<T, "id">): Promise<T> {
    const entityToUpdate = await this.model.findById(entity.id);

    if (!entityToUpdate) {
      throwEntityNotFound();
    }

    for (const key in entity) {
      const value = entity[key];

      if (value !== undefined) {
        (entityToUpdate as Partial<T>)[key] = value;
      }
    }

    await entityToUpdate.save();
    return entityToUpdate;
  }

  async updateMany(
    query: FilterQuery<T>,
    entity: PartialExcept<T, "id">
  ): Promise<T[]> {
    const entitiesToUpdate = await this.model.find(query);

    for (const entityToUpdate of entitiesToUpdate) {
      for (const key in entity) {
        const value = entity[key];

        if (value !== undefined) {
          (entityToUpdate as Partial<T>)[key] = value;
        }
      }

      await entityToUpdate.save();
    }

    return entitiesToUpdate;
  }

  async delete(id: string): Promise<T> {
    const entityToDelete = await this.model.findById(id);

    if (!entityToDelete) {
      throwEntityNotFound();
    }

    await entityToDelete.remove();
    return entityToDelete;
  }

  async deleteMany(query: FilterQuery<T>): Promise<T[]> {
    const entitiesToDelete = await this.model.find(query);

    for (const entityToDelete of entitiesToDelete) {
      await entityToDelete.remove();
    }

    return entitiesToDelete;
  }
}

export interface AppSession {
  userId?: string;
}

export interface AppServiceConfig {
  entityUserProperty?: string;
}

export class AppService<T extends IEntity> {
  constructor(
    protected readonly repository: IRepository<T>,
    protected readonly config: AppServiceConfig = {}
  ) {}

  protected setUser<T>(session: AppSession, target: T): T {
    if (target && session && session.userId) {
      const userKey = this.config.entityUserProperty;

      if (userKey) {
        (target as any)[userKey] = session.userId;
      }
    }

    return target;
  }

  protected excludeUser<T>(target: T): T {
    const userKey = this.config.entityUserProperty;

    if (userKey) {
      delete (target as any)[userKey];
    }

    return target;
  }

  async find(session: AppSession, query: FilterQuery<T> = {}): Promise<T[]> {
    return await this.repository.find(this.setUser(session, query));
  }

  async findOne(
    session: AppSession,
    query: FilterQuery<T> = {}
  ): Promise<T | null> {
    return await this.repository.findOne(this.setUser(session, query));
  }

  async findById(session: AppSession, id: string): Promise<T | null> {
    const query: FilterQuery<T> = { _id: id } as any;
    return await this.findOne(session, query);
  }

  async findWithPaging(
    session: AppSession,
    pageQuery: PageFilterQuery<T> = DEFAULT_PAGE_QUERY
  ): Promise<PageResult<T>> {
    pageQuery.query = this.setUser(session, pageQuery.query || {});
    return await this.repository.findWithPaging(pageQuery);
  }

  async create(session: AppSession, entity: Partial<T>): Promise<T> {
    return await this.repository.create(this.setUser(session, entity));
  }

  async update(
    session: AppSession,
    entity: PartialExcept<T, "id">
  ): Promise<T> {
    const entityToUpdate = await this.findById(session, entity.id);

    if (!entityToUpdate) {
      throwEntityNotFound();
    }

    return await this.repository.update(this.excludeUser(entity));
  }

  async delete(session: AppSession, id: string): Promise<T> {
    const entityToDelete = await this.findById(session, id);

    if (!entityToDelete) {
      throwEntityNotFound();
    }

    return await this.repository.delete(id);
  }
}

function throwEntityNotFound(): never {
  throw new Error("Entity not found");
}
