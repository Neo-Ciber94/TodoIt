import { withRestApi } from "@lib/core/withRestApi";
import { TodoRepository } from "@lib/repositories/todo.repository";
import { Validate } from "@lib/utils/validate";

export default withRestApi(new TodoRepository(), {
  route: "/todos",
  update: async (repo, req) => {
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
    return repo.update(id, { title, content, completed });
  },
});
