import { ApiController } from "@server/controllers/api-controller";
import { errorHandler } from "@server/controllers/utils";
import { TodoDocument } from "@server/database/schemas/todo.types";
import authMiddleware from "@server/middlewares/auth";
import mongoDbMiddleware from "@server/middlewares/mongodb";
import { TodoRepository } from "@server/repositories/todo.repository";
import { buildPaginationOptions } from "@server/repositories/utils";
import { AppApiContext } from "@server/types";
import {
  todoCreateValidator,
  todoUpdateValidator,
} from "@server/validators/todos.validators";
import { ITodo } from "@shared/models/todo.model";
import { FilterQuery } from "mongoose";
import morgan from "morgan";
import {
  Get,
  Post,
  Put,
  Delete,
  UseMiddleware,
  withController,
  OnError,
  Results,
  RouteController,
} from "next-controllers";
import { ValidationError } from "yup";

@UseMiddleware(morgan("dev"), authMiddleware(), mongoDbMiddleware())
class TodoController {
  private readonly todoRepository = new TodoRepository();

  @Get("/")
  getAll({ request }: AppApiContext) {
    const options = buildPaginationOptions<ITodo>(request);
    const creatorUserId = request.userId;
    let query: FilterQuery<TodoDocument> = { creatorUserId };

    if (request.query.search != null) {
      const search = String(request.query.search);
      query = { ...query, $text: { $search: search } };
    }

    return this.todoRepository.findWithPagination({
      ...options,
      query,
    });
  }

  @Get("/:id")
  get({ request }: AppApiContext) {
    const id = String(request.params.id);
    const userId = request.userId;
    return this.todoRepository.findById(id);
  }

  @Post("/")
  async create({ request }: AppApiContext) {
    const { title, content, color } = request.body;
    await todoCreateValidator.validate({ title, content, color });

    const creatorUserId = request.userId;
    return this.todoRepository.create({ title, content, color, creatorUserId });
  }

  @Put("/:id")
  async update({ request }: AppApiContext) {
    const { title, content, completed, color } = request.body;
    await todoUpdateValidator.validate({ title, content, completed, color });

    const id = String(request.params.id);
    const creatorUserId = request.userId;
    const updateTodo = {
      creatorUserId,
      title,
      content,
      completed,
      color,
    };
    return this.todoRepository.updateOne({ id }, updateTodo);
  }

  @Post("/:id/toggle")
  async toggle({ request }: AppApiContext) {
    const id = String(request.params.id);
    const todo = await this.todoRepository.findById(id);

    if (todo == null) {
      return null;
    }

    return await todo.toggleComplete();
  }

  @Delete("/:id")
  async delete({ request }: AppApiContext) {
    const id = String(request.params.id);
    return this.todoRepository.deleteOne({ id });
  }

  @OnError()
  onError(error: any) {
    console.error(error);
    const messsage = error.message || "Something went wrong";

    if (error instanceof ValidationError) {
      return Results.badRequest(messsage);
    }

    return Results.internalServerError(messsage);
  }
}

// export default withController(TodoController);

@RouteController({ onError: errorHandler })
@UseMiddleware(morgan("dev"), authMiddleware(), mongoDbMiddleware())
class TodoApiController extends ApiController<TodoDocument> {
  constructor() {
    super(new TodoRepository());
  }

  async beforeWrite(
    event: "create" | "update",
    data: TodoDocument | TodoDocument[]
  ) {
    if (Array.isArray(data)) {
      data.forEach((todo) => this.beforeWrite(event, todo));
      return;
    }

    switch (event) {
      case "create":
        await todoCreateValidator.validate(data as ITodo);
        break;
      case "update":
        await todoUpdateValidator.validate(data as ITodo);
        break;
      default:
        break;
    }
  }

  @Post("/:id/toggle")
  async toggle({ request }: AppApiContext) {
    const id = String(request.params.id);
    const creatorUser = request.userId;

    if (creatorUser == null) {
      return null;
    }

    const todo = await this.repository.findOne({ id, creatorUser });

    if (todo == null) {
      return null;
    }

    return await todo.toggleComplete();
  }
}

export default withController(TodoApiController);
