import { Document, Model } from "mongoose";
import { ITodo } from "src/shared/todo.model";

export interface TodoDocument extends ITodo, Document {
  _id: string;
  markAsCompleted(this: TodoDocument): Promise<TodoDocument>;
}

export interface TodoModel extends Model<TodoDocument> {
  findCompleted(): Promise<TodoDocument[]>;
  findIncompleted(): Promise<TodoDocument[]>;
}
