import axios, {
  Method as AxiosMethod,
  Axios,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { IHttpClient, RequestMessage } from "./http-client";

// prettier-ignore
export class AxiosApiClient implements IHttpClient<AxiosRequestConfig<any>, AxiosResponse> {
  constructor(
    private readonly baseURL: string = "",
    private readonly client: Axios = axios.create()
  ) {}

  private requestURL(url: string): string {
    return `${this.baseURL}${url}`;
  }

  create(baseURL: string): AxiosApiClient {
    return new AxiosApiClient(this.requestURL(baseURL), this.client);
  }

  send<TBody = {}, T = any>(
    url: string,
    message: RequestMessage<TBody>
  ): Promise<AxiosResponse<T>> {
    const { body: data, method, headers, params, ...config } = message;
    url = this.requestURL(url);
    
    return this.client.request<T>({
      url,
      data,
      params,
      headers,
      method: message.method as AxiosMethod,
      ...config,
    });
  }

  async get<T>(url: string, config: AxiosRequestConfig<T> = {}): Promise<T> {
    const result = await this.client.get<T>(this.requestURL(url), config);
    return result.data;
  }

  async post<T, TBody = T>(
    url: string,
    data?: TBody,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    const result = await this.client.post<T>(
      this.requestURL(url),
      data,
      config
    );
    return result.data;
  }

  async put<T, TBody = T>(
    url: string,
    data?: TBody,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    // try {
    //   const result = await this.client.put<T>(this.requestURL(url), data, config)
    //   return result.data;
    // }
    // catch (e: any) {
    //   throw new Error(e.response.data);
    // }

    const result = await this.client.put<T>(this.requestURL(url), data, config)
    return result.data;
  }

  async patch<T, TBody = T>(
    url: string,
    data?: TBody,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    const result = await this.client.patch<T>(
      this.requestURL(url),
      data,
      config
    );
    return result.data;
  }

  async delete<T>(url: string, config: AxiosRequestConfig<T> = {}): Promise<T> {
    const result = await this.client.delete<T>(this.requestURL(url), config);
    return result.data;
  }

  async options<T>(
    url: string,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    const result = await this.client.options<T>(this.requestURL(url), config);
    return result.data;
  }

  async head<T>(url: string, config: AxiosRequestConfig<T> = {}): Promise<T> {
    const result = await this.client.head<T>(this.requestURL(url), config);
    return result.data;
  }

  async trace<T>(url: string, config: AxiosRequestConfig<T> = {}): Promise<T> {
    const result = await this.client.head<T>(this.requestURL(url), config);
    return result.data;
  }
}
