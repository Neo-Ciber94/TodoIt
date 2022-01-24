import { IHttpClient, RequestConfig } from ".";
import {
  RequestMessage,
  RequestParams,
  RequestResponse,
  Self,
} from "./http-client";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export type FetchConfig = RequestInit & RequestConfig;

export interface FetchResponse extends Omit<Response, "headers"> {
  data: unknown;
  headers: Record<string, string>;
}

export class FetchClient implements IHttpClient<FetchConfig, FetchResponse> {
  constructor(private readonly baseURL: string = "") {}

  private requestURL(url: string, params: RequestParams | undefined): string {
    let fullUrl = `${this.baseURL}${url}`;

    if (params) {
      const entries = Object.entries(params);

      if (entries.length > 0) {
        const queryString: string[] = [];

        for (const [key, value] of entries) {
          const keyEncoded = encodeURIComponent(key);

          if (Array.isArray(value)) {
            for (const item of value) {
              queryString.push(`${keyEncoded}=${encodeURIComponent(item)}`);
            }
          } else {
            queryString.push(`${keyEncoded}=${encodeURIComponent(value)}`);
          }
        }

        fullUrl += `?${queryString.join("&")}`;
      }
    }

    return fullUrl;
  }

  create(baseURL: string): Self<IHttpClient<FetchConfig, RequestResponse>> {
    return new FetchClient(this.requestURL(baseURL, {}));
  }

  async send<TBody = any>(
    url: string,
    message: RequestMessage<TBody>
  ): Promise<FetchResponse> {
    const { body, ...config } = message;
    const fullUrl = this.requestURL(url, message.params);
    const response = await fetch(fullUrl, {
      ...config,
      body: body ? JSON.stringify(message.body) : undefined,
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Forwards the missing props
    const result: FetchResponse = response as any;
    result.data = response.body;
    result.headers = headers;
    return result;
  }

  get<T>(url: string, config: FetchConfig = {}): Promise<T> {
    return makeRequest(this.requestURL(url, config.params), config);
  }

  post<T, TBody = T>(
    url: string,
    data?: TBody | null,
    config: FetchConfig = {}
  ): Promise<T> {
    return makeRequest(this.requestURL(url, config.params), {
      body: data ? JSON.stringify(data) : undefined,
      method: "POST",
      ...config,
      headers: {
        ...DEFAULT_HEADERS,
        ...config.headers,
      },
    });
  }

  put<T, TBody = T>(
    url: string,
    data?: TBody | null,
    config: FetchConfig = {}
  ): Promise<T> {
    return makeRequest(this.requestURL(url, config.params), {
      body: data ? JSON.stringify(data) : undefined,
      method: "PUT",
      ...config,
      headers: {
        ...DEFAULT_HEADERS,
        ...config.headers,
      },
    });
  }

  patch<T, TBody = T>(
    url: string,
    data?: TBody | null,
    config: FetchConfig = {}
  ): Promise<T> {
    return makeRequest(this.requestURL(url, config.params), {
      body: data ? JSON.stringify(data) : undefined,
      method: "PATCH",
      ...config,
      headers: {
        ...DEFAULT_HEADERS,
        ...config.headers,
      },
    });
  }

  delete<T>(url: string, config: FetchConfig = {}): Promise<T> {
    return makeRequest(this.requestURL(url, config.params), {
      method: "DELETE",
      ...config,
    });
  }

  options<T>(url: string, config: FetchConfig = {}): Promise<T> {
    return makeRequest(this.requestURL(url, config.params), {
      method: "OPTIONS",
      ...config,
    });
  }

  head<T>(url: string, config: FetchConfig = {}): Promise<T> {
    return makeRequest(this.requestURL(url, config.params), {
      method: "HEAD",
      ...config,
    });
  }
}

async function makeRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data = await getResponseData(response);

  if (!response.ok) {
    const message = data ? toString(data) : response.statusText;
    throw new Error(message);
  }

  return data as T;
}

async function getResponseData(response: Response): Promise<unknown | null> {
  if (response.body == null) {
    return null;
  }

  if (isJsonResponse(response)) {
    return await response.json();
  }

  return await response.text();
}

function isJsonResponse(response: Response): boolean {
  return (
    response.headers.get("content-type")?.includes("application/json") ?? false
  );
}

function toString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
