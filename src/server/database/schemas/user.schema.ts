import mongoose, { Schema } from "mongoose";
import { UserDocument, UserModel } from "./user.types";

export const userSchema = new Schema<UserDocument, UserModel>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    isInitialized: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => new Date(),
    },
    updatedAt: {
      type: Date,
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

// Extensions
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const MODEL_NAME = "User";
const User: UserModel =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<UserDocument, UserModel>(MODEL_NAME, userSchema);

export default User;
