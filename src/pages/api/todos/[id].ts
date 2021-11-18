import withMongoDbApi from "@lib/rest-api/adaptors/withMongoDbApi";
import { TodoRepository } from "@lib/repositories/todo.repository";
import { Validate } from "@lib/rest-api";

const todos = new TodoRepository();

export default withMongoDbApi({
  // GET - /todos/:id
  async get(req) {
    const { id } = req.query;
    const _id = Array.isArray(id) ? id.join("") : id;
    return todos.findById(_id);
  },

   // PUT - /todos/:id
   async put(req) {
    const { id, title, content, completed } = req.body;
    Validate.isBoolean(completed, "completed");
    return await todos.update(id, { title, content, completed });
  },

  // DELETE - /todos/:id
  async delete(req) {
    const { id } = req.query;
    const _id = Array.isArray(id) ? id.join("") : id;
    return await todos.delete(_id);
  },
});
