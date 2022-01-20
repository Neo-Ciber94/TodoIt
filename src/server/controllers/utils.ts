import { Results } from "next-controllers";
import { ValidationError } from "yup";
import { AuditConfig } from "./types";

/**
 * Handlers a server error.
 * @param error The error to be handled.
 */
export function errorHandler(error: any) {
  console.error(error);
  const messsage = error.message || "Something went wrong";

  if (error instanceof ValidationError) {
    return Results.badRequest(messsage);
  }

  return Results.internalServerError(messsage);
}

/**
 * The default `AuditConfig`.
 */
export const defaultAuditProps = {
  create: "creatorUserId",
  update: "updaterUserId",
  delete: "deleterUserId",
};
