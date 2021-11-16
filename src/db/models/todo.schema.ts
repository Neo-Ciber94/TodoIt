import { Schema } from "mongoose";

const TodoSchema = new Schema({
  id: String,
  title: String,
  content: String,
  completed: Boolean,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

export default TodoSchema;
