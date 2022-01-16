import authMiddleware from "@server/middlewares/auth";
import mongoDbMiddleware from "@server/middlewares/mongodb";
import {
  TodoPaginationOptions,
  TodoRepository,
} from "@server/repositories/todo.repository";
import { buildPaginationOptions } from "@server/repositories/utils";
import { AppApiContext } from "@server/types";
import {
  todoCreateValidator,
  todoUpdateValidator,
} from "@server/validators/todos.validators";
import { ITodo } from "@shared/models/todo.model";
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
} from "next-controllers";
import { ValidationError } from "yup";

@UseMiddleware(morgan("dev"), authMiddleware(), mongoDbMiddleware())
class TodoController {
  private readonly todoRepository = new TodoRepository();

  @Get("/")
  getAll({ request }: AppApiContext) {
    // prettier-ignore
    const options = buildPaginationOptions<ITodo>(request) as TodoPaginationOptions;

    if (request.query.search) {
      options.search = String(request.query.search);
    }

    const userId = request.userId;
    return this.todoRepository.search(options, userId);
  }

  @Get("/:id")
  get({ request }: AppApiContext) {
    const id = String(request.params.id);
    const userId = request.userId;
    return this.todoRepository.findById(id, userId);
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
    return this.todoRepository.update({
      id,
      creatorUserId,
      title,
      content,
      completed,
      color,
    });
  }

  @Post("/:id/toggle")
  async toggle({ request }: AppApiContext) {
    const id = String(request.params.id);
    const userId = request.userId;
    const todo = await this.todoRepository.findById(id, userId);

    if (todo == null) {
      return null;
    }

    return await todo.toggleComplete();
  }

  @Delete("/:id")
  async delete({ request }: AppApiContext) {
    const id = String(request.params.id);
    const userId = request.userId;
    const todo = await this.todoRepository.findById(id, userId);

    if (todo == null) {
      return null;
    }

    return this.todoRepository.delete(id);
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

export default withController(TodoController);
