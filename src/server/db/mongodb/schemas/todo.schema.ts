import { model, Schema } from "mongoose";
import * as Mongoose from "mongoose";
import { TodoDocument, TodoModel } from "./todo.types";

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
});

/// Extensions
todoSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

todoSchema.methods.toggleComplete = function (
  this: TodoDocument
): Promise<TodoDocument> {
  this.completed = !this.completed;
  return this.save();
};

// prettier-ignore
const Todo = Mongoose.models.Todo as TodoModel || model<TodoDocument, TodoModel>("Todo", todoSchema);
export default Todo;
