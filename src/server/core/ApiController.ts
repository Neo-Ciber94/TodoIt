import { IRepository, PageResult } from "@server/repositories/base/repository";
import { buildPaginationOptions } from "@server/repositories/utils";
import { ValidationError } from "@server/utils/errors";
import { NextApiResponse } from "next";
import {
  Context,
  Delete,
  Get,
  HttpContext,
  NextApiContext,
  OnError,
  Patch,
  Post,
  RouteController,
} from "src/next-controllers";
import Put from "src/next-controllers/decorators/Put";

interface ApiControllerConfig<T> {
  repository: IRepository<T>;
  isReadOnly: boolean;
}

@RouteController()
export class ApiController<T> {
  constructor(private readonly repository: IRepository<T>) {}

  // @Context()
  // protected readonly context!: HttpContext;

  @Get("/")
  async getAll({ request }: NextApiContext): Promise<PageResult<T>> {
    const options = buildPaginationOptions<T>(request);
    return this.repository.findWithPagination(options);
  }

  @Get("/:id")
  async getById({ request }: NextApiContext): Promise<T | null> {
    const { id = "" } = request.params;
    let result: T | null = null;

    try {
      result = await this.repository.findById(id);
    } catch {
      // Nothing
    }

    if (result == null) {
      throw new ValidationError("Resource not found");
    }

    return result;
  }

  @Post("/")
  async create({ request }: NextApiContext): Promise<T> {
    const entity: Partial<T> = request.body;
    const result = await this.repository.create(entity);
    return result;
  }

  @Put("/:id")
  async update({ request }: NextApiContext): Promise<T> {
    const { id = "" } = request.params;
    const entity: Partial<T> = request.body;
    const result = await this.repository.update(String(id), entity);
    return result;
  }

  @Patch("/:id")
  async partialUpdate({ request }: NextApiContext): Promise<T> {
    const { id = "" } = request.params;
    const entity: Partial<T> = request.body;
    const result = await this.repository.update(id, entity);
    return result;
  }

  @Delete("/:id")
  async delete({ request }: NextApiContext): Promise<T> {
    const { id = "" } = request.params;
    const result = await this.repository.delete(id);
    return result;
  }

  @OnError()
  async onError(error: any, context: NextApiContext): Promise<void> {
    const message = error.message ?? error;

    if (error instanceof ValidationError) {
      return context.response.status(400).json({ message });
    } else {
      return context.response.status(500).json({ message });
    }
  }
}
