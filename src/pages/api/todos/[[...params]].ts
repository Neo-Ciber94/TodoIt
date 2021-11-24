import { withRestApi } from "@server/core/withRestApi";
import {
  TodoPaginationOptions,
  TodoRepository,
} from "@server/repositories/todo.repository";
import { buildPaginationOptions } from "@server/repositories/utils";
import { Validate } from "@server/utils/validate";
import { ITodo } from "src/shared/models/todo.model";

export default withRestApi(new TodoRepository(), {
  route: "/todos",
  getAll: (repo, req) => {
    const options = buildPaginationOptions<ITodo>(req) as TodoPaginationOptions;

    if (req.query.search) {
      options.search = String(req.query.search);
    }

    return repo.search(options);
  },
  create: (repo, req) => {
    const { title, content } = req.body;
    Validate.isNonBlankString(title);

    if (content) {
      Validate.isNonBlankString(content);
    }

    return repo.create({ title, content });
  },
  update: async (repo, req) => {
    const { title, content, completed } = req.body;
    Validate.isBoolean(completed);
    Validate.isNonBlankString(title);

    if (content) {
      Validate.isNonBlankString(content);
    }

    const id = req.params.id;
    return repo.update(id, { title, content, completed });
  },
  partialUpdate: async (repo, req) => {
    const { title, content, completed } = req.body;

    if (completed) {
      Validate.isBoolean(completed);
    }

    if (title) {
      Validate.isNonBlankString(title);
    }

    if (content) {
      Validate.isNonBlankString(content);
    }

    const id = req.params.id;
    return repo.partialUpdate(id, { title, content, completed });
  },
  customEndpoints: {
    post: {
      "/:id/toggle" : async (repo, req) => {
        const id = req.params.id;
        const todo = await repo.findById(id);

        if (todo == null) {
          return null;
        }

        return await todo.toggleComplete();
      }
    }
  }
});
