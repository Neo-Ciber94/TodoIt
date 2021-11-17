import { Document, Model } from "mongoose";

export interface ITodo {
  title: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoDocument extends ITodo, Document<ITodo> {
  markAsCompleted(this: TodoDocument): Promise<TodoDocument>;
}

export interface TodoModel extends Model<TodoDocument> {
  findCompleted(): Promise<TodoDocument[]>;
  findIncompleted(): Promise<TodoDocument[]>;
}
