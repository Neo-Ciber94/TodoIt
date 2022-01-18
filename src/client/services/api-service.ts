import { PageResult } from "@server/repositories/base/repository";
import { API_URL } from "src/client/constants";
import {
  AxiosApiClient,
  IHttpClient,
  RequestConfig,
} from "src/client/http-client";
import { FetchClient } from "../http-client/fetch.client";

let useAxios = true;

// HTTP Client shared by all services.
export let clientInstance: IHttpClient;

if (useAxios) {
  clientInstance = new AxiosApiClient(API_URL);
} else {
  clientInstance = new FetchClient(API_URL);
}

export interface PagingOptions {
  page?: number;
  pageSize?: number;
}

export class ApiService<T, TKey = string> {
  protected readonly client: IHttpClient;

  constructor(routeUrl: string) {
    if (!routeUrl.startsWith("/")) {
      throw new Error("Route url must start with '/'");
    }

    this.client = clientInstance.create(routeUrl);
  }

  async getWithPagination(
    options: PagingOptions = {},
    config: RequestConfig = {}
  ): Promise<PageResult<T>> {
    const { page = 1, pageSize = 10 } = options;
    const result = await this.client.get<PageResult<T>>(`/`, {
      ...config,
      params: {
        page,
        pageSize,
      },
    });

    return result;
  }

  async getById(id: TKey, config: RequestConfig = {}): Promise<T> {
    const result = await this.client.get<T>(`/${id}`, config);
    return result;
  }

  async create(data: Partial<T>, config: RequestConfig = {}): Promise<T> {
    const result = await this.client.post<T, Partial<T>>(`/`, data, config);
    return result;
  }

  async update(
    id: TKey,
    data: Partial<T>,
    config: RequestConfig = {}
  ): Promise<T> {
    const result = await this.client.put<T, Partial<T>>(`/${id}`, data, config);
    return result;
  }

  async partialUpdate(
    id: TKey,
    data: Partial<T>,
    config: RequestConfig = {}
  ): Promise<T> {
    const result = await this.client.patch<T, Partial<T>>(
      `/${id}`,
      data,
      config
    );
    return result;
  }

  async delete(id: TKey, config: RequestConfig = {}): Promise<T> {
    const result = await this.client.delete<T>(`/${id}`, config);
    return result;
  }
}
