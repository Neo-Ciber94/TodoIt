import { ApiController } from "@server/core/ApiController";
import mongodb from "@server/db/mongodb/middleware";
import { TodoRepository } from "@server/repositories/todo.repository";
import { ITodo } from "@shared/models/todo.model";
import morgan from "morgan";
import {
  RouteController,
  UseMiddleware,
  withController,
} from "src/next-controllers";

@RouteController()
@UseMiddleware([mongodb(), morgan("dev")])
class TodosController extends ApiController<ITodo> {
  constructor() {
    super(new TodoRepository());
  }
}

export default withController(TodosController);
