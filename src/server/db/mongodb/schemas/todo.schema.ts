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
TodoSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

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
