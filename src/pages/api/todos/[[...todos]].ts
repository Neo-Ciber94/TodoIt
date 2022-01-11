import authMiddleware from "@server/middlewares/auth";
import mongoDbMiddleware from "@server/middlewares/mongodb";
import {
  TodoPaginationOptions,
  TodoRepository,
} from "@server/repositories/todo.repository";
import { buildPaginationOptions } from "@server/repositories/utils";
import { AppApiContext } from "@server/types";
import { Validate } from "@server/utils/validate";
import { ITodo } from "@shared/models/todo.model";
import morgan from "morgan";
import {
  Get,
  Post,
  Put,
  Patch,
  Delete,
  UseMiddleware,
  withController,
} from "next-controllers";

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

    return this.todoRepository.search(options);
  }

  @Post("/")
  create({ request }: AppApiContext) {
    const { title, content, color } = request.body;
    Validate.isNonBlankString(title);

    if (content) {
      Validate.isNonBlankString(content);
    }

    const userId = request.userId;
    return this.todoRepository.create({ title, content, color, userId });
  }

  @Put("/:id")
  update({ request }: AppApiContext) {
    const { title, content, completed, color } = request.body;
    Validate.isBoolean(completed);
    Validate.isNonBlankString(title);

    if (content) {
      Validate.isNonBlankString(content);
    }

    const id = String(request.params.id);
    return this.todoRepository.update(id, { title, content, completed, color });
  }

  @Patch("/:id")
  patch({ request }: AppApiContext) {
    const { title, content, completed, color } = request.body;

    if (completed) {
      Validate.isBoolean(completed);
    }

    if (title) {
      Validate.isNonBlankString(title);
    }

    if (content) {
      Validate.isNonBlankString(content);
    }

    const id = String(request.params.id);
    return this.todoRepository.partialUpdate(id, {
      title,
      content,
      completed,
      color,
    });
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
  delete({ request }: AppApiContext) {
    const id = String(request.params.id);
    return this.todoRepository.delete(id);
  }
}

export default withController(TodoController);
