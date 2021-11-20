import { mongodb } from "@lib/db/mongodb/middleware";
import morgan from "morgan";
import { NextApiRequest, NextApiResponse } from "next";
import nc, { Options } from "next-connect";
import { ValidationError } from "../utils/errors";

type RequestParams = {
  [key: string]: string;
};

type NextApiRequestWithParams = NextApiRequest & { params: RequestParams };

export type NextApiHandlerWithParams<T = any> = (
  req: NextApiRequestWithParams,
  res: NextApiResponse<T>
) => Promise<T> | T;

export type NextConnectOptions<T = any> = Options<
  NextApiRequestWithParams,
  NextApiResponse<T>
>;

export default function withRoutes(options: NextConnectOptions = {}) {
  options.onError = options.onError || defaultErrorHandler;
  return nc(options).use(mongodb()).use(morgan("dev"));
}

// prettier-ignore
function defaultErrorHandler(error: any, _: NextApiRequest, res: NextApiResponse) {
  console.error(error);
  const message = error.message || error;

  if (error instanceof TypeError) {
    res.status(400).json({ message });
  } else if (error instanceof ValidationError) {
    res.status(400).json({ message });
  } else {
    res.status(500).json({ message });
  }
}
