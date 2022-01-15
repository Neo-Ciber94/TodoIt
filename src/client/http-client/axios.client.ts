import axios, {
  Method as AxiosMethod,
  Axios,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosPromise,
  AxiosError,
} from "axios";
import { string } from "yup";
import { IHttpClient, RequestMessage } from "./http-client";

export class AxiosApiClient
  implements IHttpClient<AxiosRequestConfig<any>, AxiosResponse>
{
  constructor(
    private readonly baseURL: string = "",
    private readonly client: Axios = axios.create()
  ) {}

  create(baseURL: string): AxiosApiClient {
    return new AxiosApiClient(this.requestURL(baseURL), this.client);
  }

  async send<TBody = {}, T = any>(
    url: string,
    message: RequestMessage<TBody>
  ): Promise<AxiosResponse<T>> {
    const { body: data, method, headers, params, ...config } = message;
    url = this.requestURL(url);

    return makeRequest(() =>
      this.client.request<T>({
        url,
        data,
        params,
        headers,
        method: message.method as AxiosMethod,
        ...config,
      })
    );
  }

  async get<T>(url: string, config: AxiosRequestConfig<T> = {}): Promise<T> {
    const response = await makeRequest(() =>
      this.client.get<T>(this.requestURL(url), config)
    );

    return response.data;
  }

  async post<T, TBody = T>(
    url: string,
    data?: TBody,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    const response = await makeRequest(() =>
      this.client.post<T>(this.requestURL(url), data, config)
    );

    return response.data;
  }

  async put<T, TBody = T>(
    url: string,
    data?: TBody,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    const response = await makeRequest(() =>
      this.client.put<T>(this.requestURL(url), data, config)
    );

    return response.data;
  }

  async patch<T, TBody = T>(
    url: string,
    data?: TBody,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    const response = await makeRequest(() =>
      this.client.patch<T>(this.requestURL(url), data, config)
    );

    return response.data;
  }

  async delete<T>(url: string, config: AxiosRequestConfig<T> = {}): Promise<T> {
    const response = await makeRequest(() =>
      this.client.delete<T>(this.requestURL(url), config)
    );

    return response.data;
  }

  async options<T>(
    url: string,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    const response = await makeRequest(() =>
      this.client.options<T>(this.requestURL(url), config)
    );
    return response.data;
  }

  async head<T>(url: string, config: AxiosRequestConfig<T> = {}): Promise<T> {
    const response = await makeRequest(() =>
      this.client.head<T>(this.requestURL(url), config)
    );

    return response.data;
  }

  private requestURL(url: string): string {
    return `${this.baseURL}${url}`;
  }
}

// prettier-ignore
async function makeRequest<T>(f: () => AxiosPromise<T>): Promise<AxiosResponse<T>> {
  try {
    return await f();
  } catch (err: any) {
    const axiosError = err as AxiosError;

    if (axiosError.response && axiosError.response.data) {
      let message: string;

      if (isJsonResponse(axiosError.response)) {
        message = JSON.stringify(axiosError.response.data);
      } else {
        message = axiosError.response.data.toString();
      }

      throw new Error(message);
    } else {
      throw err;
    }
  }
}

function isJsonResponse(response: AxiosResponse): boolean {
  return response.headers["content-type"] === "application/json";
}
