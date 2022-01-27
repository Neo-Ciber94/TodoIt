import Todo from "@server/database/schemas/todo.schema";
import { TodoDocument, TodoModel } from "@server/database/schemas/todo.types";
import { Repository } from "./base/repository.base";

export class TodoRepository extends Repository<TodoDocument, TodoModel> {
  constructor() {
    super(Todo);
  }

  async toggle(id: string, creatorUser: string): Promise<TodoDocument | null> {
    const todo = await this.findOne({ id, creatorUser });

    if (todo == null) {
      return null;
    }

    return await todo.toggleComplete();
  }
}
