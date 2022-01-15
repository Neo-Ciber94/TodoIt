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

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  return await res.json();
}

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
      const keys = Object.keys(params);

      if (keys.length > 0) {
        const queryString = keys
          .map((key) => `${key}=${params[key]}`)
          .join("&");

        fullUrl += `?${queryString}`;
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
    return fetchJson(this.requestURL(url, config.params), config);
  }

  post<T, TBody = T>(
    url: string,
    data?: TBody | null,
    config: FetchConfig = {}
  ): Promise<T> {
    return fetchJson(this.requestURL(url, config.params), {
      body: data ? JSON.stringify(data) : undefined,
      method: "POST",
      headers: {
        ...DEFAULT_HEADERS,
        ...config.headers,
      },
      ...config,
    });
  }

  put<T, TBody = T>(
    url: string,
    data?: TBody | null,
    config: FetchConfig = {}
  ): Promise<T> {
    return fetchJson(this.requestURL(url, config.params), {
      body: data ? JSON.stringify(data) : undefined,
      method: "PUT",
      headers: {
        ...DEFAULT_HEADERS,
        ...config.headers,
      },
      ...config,
    });
  }

  patch<T, TBody = T>(
    url: string,
    data?: TBody | null,
    config: FetchConfig = {}
  ): Promise<T> {
    return fetchJson(this.requestURL(url, config.params), {
      body: data ? JSON.stringify(data) : undefined,
      method: "PATCH",
      headers: {
        ...DEFAULT_HEADERS,
        ...config.headers,
      },
      ...config,
    });
  }

  delete<T>(url: string, config: FetchConfig = {}): Promise<T> {
    return fetchJson(this.requestURL(url, config.params), {
      method: "DELETE",
      ...config,
    });
  }

  options<T>(url: string, config: FetchConfig = {}): Promise<T> {
    return fetchJson(this.requestURL(url, config.params), {
      method: "OPTIONS",
      ...config,
    });
  }

  head<T>(url: string, config: FetchConfig = {}): Promise<T> {
    return fetchJson(this.requestURL(url, config.params), {
      method: "HEAD",
      ...config,
    });
  }

  trace<T>(url: string, config: FetchConfig = {}): Promise<T> {
    return fetchJson(this.requestURL(url, config.params), {
      method: "TRACE",
      ...config,
    });
  }
}
