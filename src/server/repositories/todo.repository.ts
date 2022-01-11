import Todo from "@server/database/schemas/todo.schema";
import { TodoDocument, TodoModel } from "@server/database/schemas/todo.types";
import { FilterQuery } from "mongoose";
import { IRepository, PageResult, PaginationOptions } from "./base/repository";
import { RepositoryWithCreator } from "./base/repository.base";

// prettier-ignore
export type TodoPaginationOptions = Omit<PaginationOptions<TodoDocument>, "query"> & {
  search?: string;
};

export interface ITodoRepository extends IRepository<TodoDocument> {
  search(
    options: TodoPaginationOptions,
    userId: string
  ): Promise<PageResult<TodoDocument>>;
}

// prettier-ignore
export class TodoRepository extends RepositoryWithCreator<TodoDocument, TodoModel> implements ITodoRepository {
  constructor() {
    super(Todo);
  }

  search(options: TodoPaginationOptions, userId?: string): Promise<PageResult<TodoDocument>> {
    if (userId == null) {
      throw new Error("User id is required");
    }

    if (options.search == null) {
      return super.findWithPagination(options, userId);
    }

    const query: FilterQuery<TodoDocument> = {
      $or: [
        { title: { $regex: options.search, $options: "i" } },
        { content: { $regex: options.search, $options: "i" } },
      ],
    };
 
    const newOptions = { ...options, query };
    return super.findWithPagination(newOptions, userId);
  }
}
