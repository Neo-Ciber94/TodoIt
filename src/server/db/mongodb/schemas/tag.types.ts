import { ITag } from "@shared/models/tag.model";
import { Document, Model } from "mongoose";

export interface TagDocument extends ITag, Document {
    id: string;
}

export interface TagModel extends Model<TagDocument> {}
