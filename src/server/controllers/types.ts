import { FilterQuery } from "mongoose";

/**
 * Data for the current session.
 */
export interface AppSession {
  /**
   * The user id of the current user.
   */
  userId?: string;
}

/**
 * Query params of `NextJS`.
 */
export type NextQueryParams = { [key: string]: string | string[] };

/**
 * Converts the given query params to a mongodb `FilterQuery`.
 */
export type QueryParamsMapper<T> = (params: NextQueryParams) => FilterQuery<T>;

/**
 * Configuration for the controller.
 */
export interface ControllerConfig<T = any> {
  /**
   * Whether if inject the session data like the `userId` in the queries.
   * Default is `true`.
   */
  useSession?: boolean;

  /**
   * The name of the property to set the user id to when creating, updating, deleting or filtering entities.
   * Defaults to `creatorUserId`.
   */
  userPropertyName?: string;

  /**
   * Enables text search within the controller.
   * By default is `false` but if enable will use the property `search`
   * of the request query.
   */
  search?: boolean;

  /**
   * The name of the property in a request query params to be used to execute a search query.
   * Defaults to `search`.
   */
  searchPropertyName?: string;

  /**
   * Enables query using the query params of the request.
   * By default is `false`.
   */
  query?: boolean | QueryParamsMapper<T>;

  /**
   * Whether if audit `create`/`update`/`delete` operations in the controller.
   * Default is `true`.
   *
   * This sets the user id of the user performing that operation in a property
   * defined by the `AuditConfig` by default those properties are: `creatorUserId`, `updaterUserId` and  `deleterUserId`.
   */
  audit?: boolean | AuditConfig;
}

/**
 * Configuration for auditing operations.
 */
export interface AuditConfig {
  /**
   * Audit create. Default is `creatorUserId`.
   */
  create: boolean | string;

  /**
   * Audit create. Default is `updaterUserId`.
   */
  update: boolean | string;

  /**
   * Audit create. Default is `deleterUserId`.
   */
  delete: boolean | string;
}