import { ApiController } from "@server/controllers/api-controller";
import { errorHandler } from "@server/controllers/utils";
import { commonMiddlewares } from "@server/middlewares/common";
import { TodoRepository } from "@server/repositories/todo.repository";
import type { ApiContext, EntityInput } from "@server/types";
import {
  todoCreateValidator,
  todoUpdateValidator,
} from "@server/validators/todos.validators";
import { ITodo } from "@shared/models/todo.model";
import {
  Post,
  UseMiddleware,
  withController,
  RouteController,
  Put,
} from "next-controllers";

@RouteController({ onError: errorHandler })
@UseMiddleware(...commonMiddlewares)
class TodoApiController extends ApiController<ITodo, TodoRepository> {
  constructor() {
    super(new TodoRepository(), { search: true, query: true });
  }

  async beforeCreate(entity: EntityInput<ITodo>) {
    await todoCreateValidator.validate(entity);
  }

  async beforeUpdate(entity: EntityInput<ITodo>) {
    await todoUpdateValidator.validate(entity);
  }

  @Post("/")
  async create(context: ApiContext<any>): Promise<ITodo> {
    const entity = context.request.body as EntityInput<ITodo>;
    await todoCreateValidator.validate(entity);
    this.setAuditData("creator", entity);
    this.setAuditData("creator", entity.tags);

    return this.repository.create(entity, undefined, context.request.userId);
  }

  @Put("/:id")
  async updateOne(context: ApiContext<any>): Promise<ITodo | null> {
    const id = String(context.request.params.id);
    const entity = context.request.body as EntityInput<ITodo>;

    await todoUpdateValidator.validate(entity);
    this.setAuditData("updater", entity);
    this.setAuditData("creator", entity.tags);

    // Create the query to update the todo
    const query = { _id: id };
    this.setAuditData("creator", query);
    return this.repository.updateOne(
      query,
      entity,
      undefined, // session
      context.request.userId
    );
  }

  @Post("/:id/toggle")
  toggle({ request }: ApiContext) {
    const id = String(request.params.id);
    const creatorUser = request.userId;

    if (creatorUser == null) {
      return null;
    }

    return this.repository.toggle(id, creatorUser);
  }
}

export default withController(TodoApiController);
