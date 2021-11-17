import { model, Schema } from "mongoose";
import * as Mongoose from "mongoose";
import { TodoDocument, TodoModel } from "./todo.types";

const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  completed: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

/// Extensions

TodoSchema.methods.markAsCompleted = function (
  this: TodoDocument
): Promise<TodoDocument> {
  this.completed = true;
  return this.save();
};

TodoSchema.statics.findCompleted = async (): Promise<TodoDocument[]> => {
  return await Todo.find({ completed: true });
};

TodoSchema.statics.findIncompleted = async (): Promise<TodoDocument[]> => {
  return await Todo.find({ completed: false });
};

// prettier-ignore
const Todo = Mongoose.models.Todo || model<TodoDocument, TodoModel>("Todo", TodoSchema);
export default Todo;
