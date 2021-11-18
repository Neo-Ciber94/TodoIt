import withApi from "@lib/api/withApi";
import { TodoRepository } from "@lib/repositories/todo.repository";
import { Validate } from "@lib/rest-api";

const todos = new TodoRepository();

export default withApi({
  // GET - /api/todos/:id
  async get(req) {
    const { id } = req.query;
    const _id = Array.isArray(id) ? id.join("") : id;
    return todos.findById(_id);
  },

   // PUT - /api/todos/:id
   async put(req) {
    const { id, title, content, completed } = req.body;
    Validate.isBoolean(completed, "completed");
    return await todos.update(id, { title, content, completed });
  },

  // DELETE - /api/todos/:id
  async delete(req) {
    const { id } = req.query;
    const _id = Array.isArray(id) ? id.join("") : id;
    return await todos.delete(_id);
  },
});
