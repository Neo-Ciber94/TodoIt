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
class TodoApiController extends ApiController<TodoDocument, TodoRepository> {
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

    const userId = this.session.userId || ""; // Empty string is an invalid id
    const tagsToCreate: EntityInput<ITag>[] = entity.tags as any;
    const tags: ITag[] = await this.tagRepository.findOrCreate(
      tagsToCreate,
      userId
    );
    entity.tags = tags;

    const newEntity = await this.repository.create(entity);
    return newEntity;
  }

  @Put("/:id")
  async updateOne(context: AppApiContext<any>): Promise<TodoDocument | null> {
    // FIXME: Run in a transaction
    const id = String(context.request.params.id);
    const entity = context.request.body as EntityInput<ITodo>;

    await todoUpdateValidator.validate(entity);
    this.setAuditData("updater", entity);
    this.setAuditData("creator", entity.tags);

    const userId = this.session.userId || ""; // Empty string is an invalid id
    const tagsToCreate: EntityInput<ITag>[] = entity.tags as any;

    // Create the query to update the todo
    const query = { _id: id } as any;
    this.setAuditData("creator", query);

    // Check if exists
    const exist = await this.repository.findOne(query).then((e) => e != null);
    if (exist === false) {
      return null;
    }

    const tags: ITag[] = await this.tagRepository.findOrCreate(
      tagsToCreate,
      userId
    );

    entity.tags = tags;

    const newEntity = await this.repository.updateOne(query, entity);
    return newEntity;
  }

  @Post("/:id/toggle")
  toggle({ request }: AppApiContext) {
    const id = String(request.params.id);
    const creatorUser = request.userId;

    if (creatorUser == null) {
      return null;
    }

    return this.repository.toggle(id, creatorUser);
  }
}

export default withController(TodoApiController);
