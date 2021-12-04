import { IRepository, PageResult } from "@server/repositories/base/repository";
import { buildPaginationOptions } from "@server/repositories/utils";
import {
  Context,
  Delete,
  Get,
  HttpContext,
  Patch,
  Post,
  RouteController,
} from "src/next-controllers";
import Put from "src/next-controllers/decorators/Put";

@RouteController()
export class ApiController<T> {
  constructor(private readonly repository: IRepository<T>) {}

  @Context()
  protected readonly context!: HttpContext;

  @Get("/")
  async getAll(): Promise<PageResult<T>> {
    const { request } = this.context;
    const options = buildPaginationOptions<T>(request);
    return this.repository.findWithPagination(options);
  }

  @Get("/:id")
  async getById(): Promise<T | null> {
    const { id = "" } = this.context.requestParams;
    const result = await this.repository.findById(id);
    return result;
  }

  @Post("/")
  async create(): Promise<T> {
    const entity: Partial<T> = this.context.requestBody;
    const result = await this.repository.create(entity);
    return result;
  }

  @Put("/:id")
  async update(): Promise<T> {
    const { id = "" } = this.context.requestParams;
    const entity: Partial<T> = this.context.requestBody;
    const result = await this.repository.update(String(id), entity);
    return result;
  }

  @Patch("/:id")
  async partialUpdate(): Promise<T> {
    const { id = "" } = this.context.requestParams;
    const entity: Partial<T> = this.context.requestBody;
    const result = await this.repository.update(id, entity);
    return result;
  }

  @Delete("/:id")
  async delete(): Promise<T> {
    const { id = "" } = this.context.requestParams;
    const result = await this.repository.delete(id);
    return result;
  }
}
