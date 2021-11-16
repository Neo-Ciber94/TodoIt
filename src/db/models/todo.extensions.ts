import Todo from "./todo.model";
import TodoSchema from "./todo.schema";
import { ITodoDocument } from "./todo.types";

TodoSchema.methods.markAsCompleted = function (
  this: ITodoDocument
): Promise<ITodoDocument> {
  this.completed = true;
  return this.save();
};

TodoSchema.statics.findCompleted = async (): Promise<ITodoDocument[]> => {
  return await Todo.find({ completed: true });
};

TodoSchema.statics.findIncompleted = async (): Promise<ITodoDocument[]> => {
  return await Todo.find({ completed: false });
};
