import { IRepository, PageResult } from "@server/repositories/base/repository.base";
import { buildPaginationOptions } from "@server/repositories/utils";
import { AppApiContext, EntityInput, IEntity } from "@server/types";
import { FilterQuery } from "mongoose";
import { Get, Post, Put, Delete } from "next-controllers";
import { ControllerBase } from "./controller.base";
import { ControllerConfig } from "./types";

/**
 * A read-only api controller.
 */
export class ApiReadOnlyController<
  T extends IEntity,
  TRepo extends IRepository<T> = IRepository<T>
> extends ControllerBase {
  constructor(
    protected readonly repository: TRepo,
    config: ControllerConfig<T> = {}
  ) {
    super(config);
  }

  /**
   * Gets a paginated list of entities.
   * @param context The context of the request.
   * @returns A paginated result.
   */
  @Get("/")
  async find(context: AppApiContext): Promise<PageResult<T> | T[]> {
    const { page, pageSize } = context.request.query;

    // If dont have a page or pageSize, return all the entities
    if (page == null && pageSize == null) {
      const query: FilterQuery<T> = {};
      this.setAuditData("creator", query);
      const result = await this.repository.find(query);
      return result;
    }
    // Otherwise return a paginated result
    else {
      const options = buildPaginationOptions<T>(context.request, {
        query: this.config.query,
        search: this.config.search,
        searchPropertyName: this.config.searchPropertyName,
      });
      options.query = options.query || {};
      this.setAuditData("creator", options.query);
      const result = await this.repository.findWithPagination(options);
      return result;
    }
  }

  /**
   * Finds the entity with the given `id`.
   * @param context The context of the request.
   * @returns The found entity or 404 if not found.
   */
  @Get("/:id")
  async findById(context: AppApiContext): Promise<T | null> {
    const id = String(context.request.params.id);
    const query: FilterQuery<T> = { _id: id } as any;
    this.setAuditData("creator", query);
    const result = await this.repository.findOne(query);
    return result;
  }
}

/**
 * A api controller.
 */
export class ApiController<
  T extends IEntity,
  TRepo extends IRepository<T> = IRepository<T>
> extends ApiReadOnlyController<T, TRepo> {
  constructor(repository: TRepo, config: ControllerConfig = {}) {
    super(repository, config);
  }

  /**
   * A function to run before create an entity, useful for validation.
   * @param data The data used to create a new entity.
   */
  protected beforeCreate?(data: EntityInput<T>): Promise<void> | void;

  /**
   * A function to run before update an entity, useful for validation.
   * @param data The data used to update the entity.
   */
  protected beforeUpdate?(data: EntityInput<T>): Promise<void> | void;

  /**
   * Creates a new entity or list of entities.
   * @param context The context of the request.
   * @returns The created entity or entities.
   */
  @Post("/")
  async create(context: AppApiContext): Promise<T | T[]> {
    const data = context.request.body || {};
    this.setAuditData("creator", data);

    if (Array.isArray(data)) {
      if (this.beforeUpdate) {
        for (const e of data) {
          await this.beforeCreate?.(e);
        }
      }

      return this.repository.createMany(data);
    } else {
      this.beforeCreate?.(data);
      return this.repository.create(data);
    }
  }

  /**
   * Updates an entity with the given id.
   * @param context The context of the request.
   * @returns The updated entity or 404 if not found.
   */
  @Put("/:id")
  updateOne(context: AppApiContext): Promise<T | null> {
    const { request } = context;
    const id = String(request.params.id);
    const data = request.body || {};
    const query: FilterQuery<T> = { _id: id } as any;

    this.setAuditData("creator", query);
    this.setAuditData("updater", data);
    this.beforeUpdate?.(data);
    return this.repository.updateOne(query, data);
  }

  /**
   * Deletes an entity with the given id.
   * @param context The context of the request.
   * @returns The deleted entity or 404 if not found.
   */
  @Delete("/:id")
  deleteOne(context: AppApiContext): Promise<T | null> {
    const id = String(context.request.params.id);
    const query: FilterQuery<T> = { _id: id } as any;
    this.setAuditData("creator", query);
    const softDelete = this.config.softDelete;

    if (typeof softDelete === "string") {
      const entity = { [softDelete]: true } as any;
      this.setAuditData("deleter", entity);
      return this.repository.updateOne(query, entity);
    } else {
      return this.repository.deleteOne(query);
    }
  }
}
