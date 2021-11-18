import Todo from "@lib/models/todo.schema";
import { TodoDocument, TodoModel } from "@lib/models/todo.types";
import { MongoRepository } from "./base/mongo.repository";

export class TodoRepository extends MongoRepository<TodoDocument, TodoModel> {
  constructor() {
    super(Todo);
  }
}
