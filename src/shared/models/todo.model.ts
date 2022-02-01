import { ITag, ITagInput } from "./tag.model";

export interface ITodo {
  id: string;
  title: string;
  content?: string;
  color: string;
  creatorUserId: string;
  tags: ITag[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ITodoInput = Pick<ITodo, "title" | "content" | "color"> & {
  completed?: boolean;
  tags: ITagInput[];
};
