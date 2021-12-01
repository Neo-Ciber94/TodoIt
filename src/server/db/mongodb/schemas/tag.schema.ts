import moongoose, { Schema } from "mongoose";
import { TagDocument, TagModel } from "./tag.types";

const tagSchema = new Schema<TagDocument, TagModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
  moongoose.models.Tag ||
  moongoose.model<TagDocument, TagModel>("Tag", tagSchema);

export default Tag;
