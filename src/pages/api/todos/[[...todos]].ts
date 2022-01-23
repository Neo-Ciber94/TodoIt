import { ApiController } from "@server/controllers/api-controller";
import { errorHandler } from "@server/controllers/utils";
import { TodoDocument } from "@server/database/schemas/todo.types";
import { commonMiddlewares } from "@server/middlewares/common";
import { TagRepository } from "@server/repositories/tag.repository";
import { TodoRepository } from "@server/repositories/todo.repository";
import { AppApiContext, EntityInput } from "@server/types";
import {
  todoCreateValidator,
  todoUpdateValidator,
} from "@server/validators/todos.validators";
import { ITag } from "@shared/models/tag.model";
import { ITodo, ITodoInput } from "@shared/models/todo.model";
import {
  Post,
  UseMiddleware,
  withController,
  RouteController,
} from "next-controllers";

@RouteController({ onError: errorHandler })
@UseMiddleware(...commonMiddlewares)
class TodoApiController extends ApiController<TodoDocument> {
  private readonly tagRepository = new TagRepository();

  constructor() {
    super(new TodoRepository(), { search: true, query: true });
  }

  async beforeCreate(entity: EntityInput<TodoDocument>) {
    await todoCreateValidator.validate(entity);
  }

  async beforeUpdate(entity: EntityInput<TodoDocument>) {
    await todoUpdateValidator.validate(entity);
  }

  @Post("/")
  async create(context: AppApiContext<any>): Promise<TodoDocument> {
    const entity = context.request.body as EntityInput<ITodo>;
    await todoCreateValidator.validate(entity);
    this.setAuditData("creator", entity);
    this.setAuditData("creator", entity.tags);

    const userId = this.session.userId || "";
    const tagsToCreate: EntityInput<ITag>[] = entity.tags as any;
    const tags: ITag[] = await this.tagRepository.findOrCreate(
      tagsToCreate,
      userId
    );
    entity.tags = tags;

    const newEntity = await this.repository.create(entity);
    console.log(newEntity);
    return newEntity;
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
