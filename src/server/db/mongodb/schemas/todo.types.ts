import { Document, Model } from "mongoose";
import { ITodo } from "src/shared/models/todo.model";

export interface TodoDocument extends ITodo, Document {
  id: string;
  toggleComplete(this: TodoDocument): Promise<TodoDocument>;
}

export interface TodoModel extends Model<TodoDocument> {}
