import { TodoRepository } from "@lib/repositories/todo.repository";
import withMongoDbApi from "@lib/rest-api/adaptors/withMongoDbApi";
import { Validate } from "@lib/rest-api";
import { SortDirection } from "@lib/repositories/base/repository";
import { ArrayUtils } from "@lib/utils/ArrayUtils";

const todos = new TodoRepository();

export default withMongoDbApi({
  // GET - /api/todos/
  get(req) {
    const { page, pageSize, sort, sortAscending, sortDescending } = req.query;
    const sorting: Record<string, SortDirection> = {};

    if (sort) {
      for (const key of ArrayUtils.getOrArray(sort)) {
        sorting[key] = SortDirection.Descending;
      }
    }

    if (sortAscending) {
      for (const key of ArrayUtils.getOrArray(sortAscending)) {
        sorting[key] = SortDirection.Ascending;
      }
    }

    if (sortDescending) {
      for (const key of ArrayUtils.getOrArray(sortDescending)) {
        sorting[key] = SortDirection.Descending;
      }
    }

    return todos.findWithPagination(Number(page), Number(pageSize), sorting);
  },

  // POST - /api/todos/
  async post(req) {
    const { title, content } = req.body;
    Validate.isRequired(title, "title");
    return await todos.create({ title, content });
  },
});
