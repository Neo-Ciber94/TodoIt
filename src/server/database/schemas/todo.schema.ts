import mongoose, { Model, Schema, SchemaTypes } from "mongoose";
import autoPopulate from "mongoose-autopopulate";
import { PASTEL_COLORS } from "@shared/config";
import { ITodo } from "@shared/models/todo.model";

export interface TodoMethods {
  id: string;
  toggleComplete(): void;
}

export type TodoModel = Model<ITodo, {}, TodoMethods>;

const todoSchema = new Schema<ITodo, TodoModel, TodoMethods>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
      required: true,
      default: PASTEL_COLORS[0],
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
    tags: {
      type: [SchemaTypes.ObjectId],
      required: true,
      ref: "Tag",
      default: [],
      autopopulate: true,
    } as any,
    creatorUserId: {
      type: String,
      trim: true,
      required: true,
    },
    createdAt: {
      type: Date,
      immutable: true,
      required: true,
      default: () => new Date(),
    },
    updatedAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Plugins
todoSchema.plugin(autoPopulate);

// Indexes
todoSchema.index({ title: "text", content: "text" });

/// Extensions
todoSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

todoSchema.methods.toggleComplete = function () {
  this.completed = !this.completed;
};

// prettier-ignore
const Todo = <TodoModel>mongoose.models.Todo || mongoose.model<ITodo, TodoModel>("Todo", todoSchema);
export default Todo;
