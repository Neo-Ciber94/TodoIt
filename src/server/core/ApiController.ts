import {
  IRepository,
  PageResult,
  PaginationOptions,
} from "@server/repositories/base/repository";
import { NextApiResponse } from "next";
import {
  Delete,
  Get,
  HttpContext,
  NextApiRequestWithParams,
  Patch,
  Post,
  RouteController,
} from "src/next-controllers";
import Put from "src/next-controllers/decorators/Put";

@RouteController({
  context: true,
})
export class ApiController<T> {
  constructor(private readonly repository: IRepository<T>) {}

  protected readonly context!: HttpContext;

  @Get("/")
  async getAll(options: PaginationOptions<T>): Promise<PageResult<T>> {
    const result = await this.repository.findWithPagination(options);
    return result;
  }

  @Get("/:id")
  async getById(): Promise<T | null> {
    const id = this.context.request.params.id || "";
    const result = await this.repository.findById(id);
    return result;
  }

  @Post("/")
  async create(req: NextApiRequestWithParams): Promise<T> {
    const entity: Partial<T> = req.body;
    const result = await this.repository.create(entity);
    return result;
  }

  @Put("/:id")
  async update(req: NextApiRequestWithParams): Promise<T> {
    const id = req.params.id || "";
    const entity: Partial<T> = req.body;
    const result = await this.repository.update(id, entity);
    return result;
  }

  @Patch("/:id")
  async partialUpdate(req: NextApiRequestWithParams): Promise<T> {
    const id = req.params.id || "";
    const entity: Partial<T> = req.body;
    const result = await this.repository.update(id, entity);
    return result;
  }

  @Delete("/:id")
  async delete(req: NextApiRequestWithParams): Promise<T> {
    const id = req.params.id || "";
    const result = await this.repository.delete(id);
    return result;
  }
}
