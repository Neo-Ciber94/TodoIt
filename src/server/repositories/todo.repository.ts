import Todo, { TodoModel } from "@server/database/schemas/todo.schema";
import { ThrowHelper } from "@server/errors";
import { EntityInput } from "@server/types";
import { ITag } from "@shared/models/tag.model";
import { ITodo } from "@shared/models/todo.model";
import { ClientSession, FilterQuery } from "mongoose";
import { Repository } from "./base/repository";
import { TagRepository } from "./tag.repository";
import { runTransaction } from "./utils";

export class TodoRepository extends Repository<ITodo, TodoModel> {
  private readonly tagRepository = new TagRepository();

  constructor() {
    super(Todo);
  }

  async create(
    entity: EntityInput<ITodo>,
    session?: ClientSession,
    userId?: string
  ): Promise<ITodo> {
    if (userId == null) {
      ThrowHelper.expectedUserId();
    }

    const tagsToCreate: EntityInput<ITag>[] = entity.tags as any;
    const tags: ITag[] = await this.tagRepository.findOrCreate(
      tagsToCreate,
      userId,
      session
    );
    entity.tags = tags;

    const newEntity = await this.model.create(entity);
    return newEntity;
  }

  updateOne(
    query: FilterQuery<ITodo>,
    entity: EntityInput<ITodo>,
    session?: ClientSession,
    userId?: string
  ): Promise<ITodo | null> {
    if (userId == null) {
      ThrowHelper.expectedUserId();
    }

    return runTransaction(this.model, session, async (session) => {
      const tagsToCreate: EntityInput<ITag>[] = entity.tags || [];
      const tags: ITag[] = await this.tagRepository.findOrCreate(
        tagsToCreate,
        userId,
        session
      );

      entity.tags = tags;

      return this.model.findByIdAndUpdate(query, entity, {
        session,
      });
    });
  }

  async toggle(id: string, creatorUser: string): Promise<ITodo | null> {
    const todo = await this.model.findOne({ id, creatorUser });

    if (todo == null) {
      return null;
    }

    todo.toggleComplete();
    await todo.save();
    return todo;
  }
}
