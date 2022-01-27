import { Results } from "next-controllers";
import { ValidationError } from "yup";

/**
 * Handlers a server error.
 * @param error The error to be handled.
 */
export function errorHandler(error: any) {
  // eslint-disable-next-line no-console
  console.error(error);

  if (error instanceof ValidationError) {
    return Results.badRequest(error.message);
  }

  if (process.env.NODE_ENV === "development") {
  }

  let message: string = "Something went wrong";
  
  if (process.env.NODE_ENV !== "development") {
    message = error.message || message;
  }

  return Results.internalServerError(message);
}

/**
 * The default `AuditConfig`.
 */
export const defaultAuditProps = {
  creator: "creatorUserId",
  updater: "updaterUserId",
  deleter: "deleterUserId",
};
