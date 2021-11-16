import { Schema } from "mongoose";
import ObjectId from "mongoose";

const TodoSchema = new Schema({
  _id: ObjectId,
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

export default TodoSchema;
