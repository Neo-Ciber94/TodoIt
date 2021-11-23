import Todo from "@server/db/mongodb/schemas/todo.schema";
import { TodoDocument, TodoModel } from "@server/db/mongodb/schemas/todo.types";
import { FilterQuery } from "mongoose";
import { MongoRepository } from "./base/mongo.repository";
import { IRepository, PageResult, PaginationOptions, Query } from "./base/repository";

export type TodoPaginationOptions = Omit<
  PaginationOptions<TodoDocument>,
  "query"
> & {
  search?: string;
};

export interface ITodoRepository extends IRepository<TodoDocument> {
  search(options: TodoPaginationOptions): Promise<PageResult<TodoDocument>>;
}

export class TodoRepository
  extends MongoRepository<TodoDocument, TodoModel>
  implements ITodoRepository
{
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
      ]
    };

    // SAFETY: Merge the search query with the existing query
    const newOptions = { ...options, query };
    return this.findWithPagination(newOptions);
  }
}
