import mongodb from "@server/db/mongodb/middleware";
import {
  TodoPaginationOptions,
  TodoRepository,
} from "@server/repositories/todo.repository";
import { buildPaginationOptions } from "@server/repositories/utils";
import { Validate } from "@server/utils/validate";
import morgan from "morgan";
import {
  Delete,
  Get,
  NextApiContext,
  Patch,
  Post,
  Put,
  UseMiddleware,
  withController,
} from "next-controllers";
import { ITodo } from "src/shared/models/todo.model";

@UseMiddleware(mongodb(), morgan("dev"))
class TodoController {
  private readonly todoRepository = new TodoRepository();

  @Get("/")
  getAll({ request }: NextApiContext) {
    const options = buildPaginationOptions<ITodo>(
      request
    ) as TodoPaginationOptions;

    if (request.query.search) {
      options.search = String(request.query.search);
    }

    return this.todoRepository.search(options);
  }

  @Post("/")
  create({ request }: NextApiContext) {
    const { title, content, color } = request.body;
    Validate.isNonBlankString(title);

    if (content) {
      Validate.isNonBlankString(content);
    }

    return this.todoRepository.create({ title, content, color });
  }

  @Put("/:id")
  update({ request }: NextApiContext) {
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
  patch({ request }: NextApiContext) {
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
  async toggle({ request }: NextApiContext) {
    const id = String(request.params.id);
    const todo = await this.todoRepository.findById(id);

    if (todo == null) {
      return null;
    }

    return await todo.toggleComplete();
  }

  @Delete("/:id")
  delete({ request }: NextApiContext) {
    const id = String(request.params.id);
    return this.todoRepository.delete(id);
  }
}

export default withController(TodoController);
