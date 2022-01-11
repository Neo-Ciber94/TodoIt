import Todo from "@server/db/schemas/todo.schema";
import { TodoDocument, TodoModel } from "@server/db/schemas/todo.types";
import { FilterQuery } from "mongoose";
import { BaseRepository } from "./base/repository.base";
import { IRepository, PageResult, PaginationOptions } from "./base/repository";

// prettier-ignore
export type TodoPaginationOptions = Omit<PaginationOptions<TodoDocument>, "query"> & {
  search?: string;
};

export interface ITodoRepository extends IRepository<TodoDocument> {
  search(options: TodoPaginationOptions): Promise<PageResult<TodoDocument>>;
}

// prettier-ignore
export class TodoRepository extends BaseRepository<TodoDocument, TodoModel> implements ITodoRepository {
  constructor() {
    super(Todo);
  }

  search(options: TodoPaginationOptions): Promise<PageResult<TodoDocument>> {
    if (options.search == null) {
      return this.findWithPagination(options);
    }

    const query: FilterQuery<TodoDocument> = {
      $or: [
        { title: { $regex: options.search, $options: "i" } },
        { content: { $regex: options.search, $options: "i" } },
      ],
    };

    // SAFETY: Merge the search query with the existing query
    const newOptions = { ...options, query };
    return this.findWithPagination(newOptions);
  }
}
