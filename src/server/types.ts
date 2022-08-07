import { NextApiContext, NextApiRequestWithParams } from "next-controllers";

export interface IEntity {
  id: string;
}

export type EntityInput<T extends IEntity> = Omit<Partial<T>, "id">;

export type NextApiRequestWithUser = NextApiRequestWithParams & {
  userId?: string;
};

// prettier-ignore
export type ApiContext<T = any> = NextApiContext<T, NextApiRequestWithUser>;
