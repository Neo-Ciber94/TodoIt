export interface WithTimeStamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface WithUser extends WithTimeStamp {
  creatorUserId: string;
  updaterUserId: string;
}

export interface WithSoftDelete {
  isDeleted: boolean;
  deletedAt?: Date;
  deleterUserId?: string;
}
