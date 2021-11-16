import { model } from "mongoose";
import TodoSchema from "./todo.schema";
import { ITodoDocument, ITodoModel } from "./todo.types";

const Todo = model<ITodoDocument, ITodoModel>("Todo", TodoSchema);
export default Todo;