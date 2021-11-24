import { Document, Model } from "mongoose";
import { ITodo } from "src/shared/models/todo.model";

export interface TodoDocument extends ITodo, Document {
  id: string;
  toggleCompleted(this: TodoDocument): Promise<TodoDocument>;
}

export interface TodoModel extends Model<TodoDocument> {
  findCompleted(): Promise<TodoDocument[]>;
  findIncompleted(): Promise<TodoDocument[]>;
}
