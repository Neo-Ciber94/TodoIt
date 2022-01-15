/**
 * Self type.
 */
export type Self<Type> = ThisType<Type> & Type;

/**
 * Headers of a request.
 */
export type RequestHeaders = {
  [key: string]: string;
};

/**
 * Query params of a request.
 */
export type RequestParams = {
  [key: string]: string | number | boolean;
};

/**
 * Configuration of a request.
 */
export interface RequestConfig {
  headers?: RequestHeaders;
  params?: RequestParams;

  // Additional options.
  [key: string]: any;
}

/**
 * A request message.
 */
export type RequestMessage<T> = RequestConfig & {
  method: string;
  body?: T;
};

/**
 * The response of a request.
 */
export type RequestResponse = {
  headers: Record<string, string>;
  status: number;
  statusText: string;
  data: unknown;
};

/**
 * A base http client.
 */
export interface IHttpClient<
  TConfig extends RequestConfig = RequestConfig,
  Res extends RequestResponse = RequestResponse
> {
  /**
   * Creates a new http client adding the given base url.
   * @param baseURL The base url of the http client.
   */
  create(baseURL: string): Self<IHttpClient<TConfig>>;

  /**
   * Sends a request.
   * @param url The url of the request.
   * @param message The message of the request.
   */
  send<TBody = any>(url: string, message: RequestMessage<TBody>): Promise<Res>;

  /**
   * Performs a `GET` request.
   * @param url The url of the request.
   * @param config The configuration of the request.
   */
  get<T>(url: string, config?: TConfig): Promise<T>;

  /**
   * Performs a `POST` request.
   * @param url The url of the request.
   * @param data The body of the request.
   * @param config The configuration of the request.
   */
  post<T, TBody = T>(
    url: string,
    data?: TBody | null,
    config?: TConfig
  ): Promise<T>;

  /**
   * Performs a `PUT` request.
   * @param url The url of the request.
   * @param data The body of the request.
   * @param config The configuration of the request.
   */
  put<T, TBody = T>(
    url: string,
    data?: TBody | null,
    config?: TConfig
  ): Promise<T>;

  /**
   * Performs a `PATCH` request.
   * @param url The url of the request.
   * @param data The body of the request.
   * @param config The configuration of the request.
   */
  patch<T, TBody = T>(
    url: string,
    data?: TBody | null,
    config?: TConfig
  ): Promise<T>;

  /**
   * Performs a `DELETE` request.
   * @param url The url of the request.
   * @param config The configuration of the request.
   */
  delete<T>(url: string, config?: TConfig): Promise<T>;

  /**
   * Performs a `OPTIONS` request.
   * @param url The url of the request.
   * @param config The configuration of the request.
   */
  options<T>(url: string, config?: TConfig): Promise<T>;

  /**
   * Performs a `HEAD` request.
   * @param url The url of the request.
   * @param config The configuration of the request.
   */
  head<T>(url: string, config?: TConfig): Promise<T>;
}
