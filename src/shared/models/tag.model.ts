export interface ITag {
  id: string;
  name: string;
  creatorUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ITagInput = Pick<ITag, "name"> & {
  id?: string;
};

export type ITagBulkOperation = {
  insert: ITagInput[];
  delete: string[];
};
