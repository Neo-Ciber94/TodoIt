import Todo from "@server/database/schemas/todo.schema";
import { TodoDocument, TodoModel } from "@server/database/schemas/todo.types";
import { ThrowHelper } from "@server/errors";
import { EntityInput } from "@server/types";
import { ITag } from "@shared/models/tag.model";
import { ClientSession, FilterQuery } from "mongoose";
import { Repository } from "./base/repository";
import { TagRepository } from "./tag.repository";
import { runTransation } from "./utils";

export class TodoRepository extends Repository<TodoDocument, TodoModel> {
  private readonly tagRepository = new TagRepository();

  constructor() {
    super(Todo);
  }

  async create(
    entity: EntityInput<TodoDocument>,
    session?: ClientSession,
    userId?: string
  ): Promise<TodoDocument> {
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
    query: FilterQuery<TodoDocument>,
    entity: EntityInput<TodoDocument>,
    session?: ClientSession,
    userId?: string
  ): Promise<TodoDocument | null> {
    if (userId == null) {
      ThrowHelper.expectedUserId();
    }

    return runTransation(
      this.model,
      async (session) => {
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
      },
      session
    );
  }

  async toggle(id: string, creatorUser: string): Promise<TodoDocument | null> {
    const todo = await this.findOne({ id, creatorUser });

    if (todo == null) {
      return null;
    }

    return await todo.toggleComplete();
  }
}
