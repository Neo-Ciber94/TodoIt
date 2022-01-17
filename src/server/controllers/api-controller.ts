import { IRepository, PageResult } from "@server/repositories/base/repository";
import { buildPaginationOptions } from "@server/repositories/utils";
import { AppApiContext, EntityInput, IEntity } from "@server/types";
import { FilterQuery } from "mongoose";
import {
  Get,
  Post,
  Put,
  Delete,
  BeforeRequest,
  AfterRequest,
} from "next-controllers";
import { ControllerBase } from "./controller.base";
import { AppControllerConfig } from "./types";

export type ControllerWriteEvent = "create" | "update";

export class ApiReadOnlyController<T extends IEntity> extends ControllerBase {
  constructor(
    protected readonly repository: IRepository<T>,
    config: AppControllerConfig = {}
  ) {
    super(config);
  }

  @Get("/")
  async find({ request }: AppApiContext): Promise<PageResult<T>> {
    const options = buildPaginationOptions<T>(request);
    options.query = options.query || {};
    this.setSessionData(options.query);
    const result = await this.repository.findWithPagination(options);
    return result;
  }

  @Get("/:id")
  async findById({ request }: AppApiContext): Promise<T | null> {
    const id = String(request.params.id);
    const query: FilterQuery<T> = { _id: id } as any;
    this.setSessionData(query);
    const result = await this.repository.findOne(query);
    return result;
  }
}

export class ApiController<T extends IEntity> extends ApiReadOnlyController<T> {
  constructor(repository: IRepository<T>, config: AppControllerConfig = {}) {
    super(repository, config);
  }

  // prettier-ignore
  protected beforeWrite?(event: ControllerWriteEvent, data: EntityInput<T> | EntityInput<T>[]): Promise<void> | void;

  @Post("/")
  create({ request }: AppApiContext): Promise<T | T[]> {
    const data = request.body || {};

    console.log((this as any).__setSessionData);
    if (Array.isArray(data)) {
      data.forEach((entity) => this.setSessionData(entity));
      this.beforeWrite?.("create", data);
      return this.repository.createMany(data);
    } else {
      this.setSessionData(data);
      console.log(data);
      this.beforeWrite?.("create", data);
      return this.repository.create(data);
    }
  }

  @Put("/:id")
  updateOne({ request }: AppApiContext): Promise<T> {
    const id = String(request.params.id);
    const data = request.body || {};
    const query: FilterQuery<T> = { _id: id } as any;

    this.setSessionData(query);
    this.beforeWrite?.("update", data);
    return this.repository.updateOne(query, data);
  }

  @Delete("/:id")
  deleteOne({ request }: AppApiContext): Promise<T> {
    const id = String(request.params.id);
    const query: FilterQuery<T> = { _id: id } as any;
    this.setSessionData(query);
    return this.repository.deleteOne(query);
  }
}
