import { ObjectId } from "mongoose";

export interface ITodo {
  id: string;
  title: string;
  content: string;
  color: string;
  creatorUserId: string;
  tags: ObjectId[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
