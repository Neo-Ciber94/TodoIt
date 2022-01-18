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
 * Configuration for the controller.
 */
export interface ControllerConfig {
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
  query?: boolean;
}
