import { ITag } from "@shared/models/tag.model";
import mongoose, { Schema, Model } from "mongoose";

export interface TagMethods {
  id: string;
}

export type TagModel = Model<ITag, {}, TagMethods>;

const tagSchema = new Schema<ITag, TagModel, TagMethods>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 1,
      maxLength: 25,
    },
    creatorUserId: {
      type: String,
      required: true,
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
tagSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Tag: TagModel =
  <TagModel>mongoose.models.Tag ||
  mongoose.model<ITag, TagModel>("Tag", tagSchema);
export default Tag;
