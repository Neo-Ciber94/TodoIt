import { model, Schema } from "mongoose";
import * as Mongoose from "mongoose";
import { TodoDocument, TodoModel } from "./todo.types";

const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false,
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
const Todo = Mongoose.models.Todo as TodoModel || model<TodoDocument, TodoModel>("Todo", TodoSchema);
export default Todo;
