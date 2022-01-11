import { NextApiContext, NextApiRequestWithParams } from "next-controllers";

export type NextApiRequestWithUser = NextApiRequestWithParams & {
  userId?: string;
};

// prettier-ignore
export type AppApiContext<T = any> = NextApiContext<T, NextApiRequestWithUser>;
