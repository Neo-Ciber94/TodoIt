import { NextApiRequest, NextApiResponse } from "next";

export type Handler<T, TReturn> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => TReturn;

export type AsyncHandler<T, TReturn> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => Promise<TReturn>;

export type ApiHandler<T, TReturn> =
  | Handler<T, TReturn>
  | AsyncHandler<T, TReturn>;
