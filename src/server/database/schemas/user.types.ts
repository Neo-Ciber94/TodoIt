import { IUser } from "@shared/models/user.model";
import { Model, Document} from "mongoose";

export interface UserDocument extends IUser, Document {
  id: string;
}

export interface UserModel extends Model<UserDocument> {}
