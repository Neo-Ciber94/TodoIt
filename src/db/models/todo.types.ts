import { Document, Model } from "mongoose";

export interface ITodo {
  title: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodoDocument extends ITodo, Document<ITodo> {
  markAsCompleted(this: ITodoDocument): Promise<ITodoDocument>;
}

export interface ITodoModel extends Model<ITodoDocument> {
  findCompleted(): Promise<ITodoDocument[]>;
  findIncompleted(): Promise<ITodoDocument[]>;
}
