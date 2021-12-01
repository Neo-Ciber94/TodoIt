import mongoose, { Schema } from "mongoose";
import { UserDocument, UserModel } from "./user.types";

const userSchema = new Schema<UserDocument, UserModel>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
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
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

const User =
  mongoose.models.User ||
  mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
