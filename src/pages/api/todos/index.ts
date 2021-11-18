import type { NextApiRequest, NextApiResponse } from "next";
import withMongoDbApi from "../../../lib/api/adaptors/withMongoDbApi";
import { Validate } from "../../../lib/api/validate";
import withMongoDb from "../../../lib/db/mongodb/withMongoDb";
import Todo from "../../../lib/models/todo.schema";
import { TodoDocument, TodoModel } from "../../../lib/models/todo.types";
import { MongoRepository } from "../../../lib/repositories/base/mongo.repository";

class TodoRepository extends MongoRepository<TodoDocument, TodoModel> {
  constructor() {
    super(Todo);
  }
}

const todos = new TodoRepository();

export default withMongoDbApi({
  // GET
  get: () => todos.find(),

  // POST
  async post(req) {
    const { title, content } = req.body;
    Validate.isRequired(title, "title");
    return await todos.create({ title, content });
  },

  // PUT
  async put(req) {
    const { id, title, content, completed } = req.body;
    Validate.isBoolean(completed, "completed");
    return await todos.update(id, { title, content, completed });
  },

  // DELETE
  async delete(req) {
    const { id } = req.query;
    const _id = Array.isArray(id) ? id.join("") : id;
    return await todos.delete(_id);
  }

});
