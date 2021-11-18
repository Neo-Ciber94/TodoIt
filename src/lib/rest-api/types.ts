import { ApiHandler } from "@lib/typings/handler";
import { NextApiRequest, NextApiResponse } from "next";

export type EndpointApiHandler<T = any, TResult = any> = ApiHandler<T, TResult>;

export type VoidApiHandler<T = any> = ApiHandler<T, void>;

export type ErrorHandler = (
  error: any,
  req: NextApiRequest,
  res: NextApiResponse
) => void | Promise<void>;
