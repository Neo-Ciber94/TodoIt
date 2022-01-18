import { ApiController } from "@server/controllers/api-controller";
import { errorHandler } from "@server/controllers/utils";
import { TodoDocument } from "@server/database/schemas/todo.types";
import authMiddleware from "@server/middlewares/auth";
import mongoDbMiddleware from "@server/middlewares/mongodb";
import { TodoRepository } from "@server/repositories/todo.repository";
import { AppApiContext, EntityInput } from "@server/types";
import {
  todoCreateValidator,
  todoUpdateValidator,
} from "@server/validators/todos.validators";
import morgan from "morgan";
import {
  Post,
  UseMiddleware,
  withController,
  RouteController,
} from "next-controllers";

@RouteController({ onError: errorHandler })
@UseMiddleware(morgan("dev"), authMiddleware(), mongoDbMiddleware())
class TodoApiController extends ApiController<TodoDocument> {
  constructor() {
    super(new TodoRepository(), { search: true, query: true });
  }

  async beforeCreate(entity: EntityInput<TodoDocument>) {
    await todoCreateValidator.validate(entity);
  }

  async beforeUpdate(entity: EntityInput<TodoDocument>) {
    await todoUpdateValidator.validate(entity);
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
