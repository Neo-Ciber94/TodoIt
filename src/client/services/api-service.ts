import { PageResult } from "@server/repositories/base/repository2";
import { DeepPartial } from "@shared/types";
import { API_URL } from "src/client/constants";
import {
  AxiosApiClient,
  IHttpClient,
  RequestConfig,
} from "src/client/http-client";
import { FetchClient } from "../http-client/fetch.client";

const USE_AXIOS = process.env.NEXT_PUBLIC_USE_AXIOS === "true";

// HTTP Client shared by all services.
export const clientInstance: IHttpClient = USE_AXIOS
  ? new AxiosApiClient(API_URL)
  : new FetchClient(API_URL);

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

  async getAll(config: RequestConfig = {}): Promise<T[]> {
    const result = await this.client.get<T[]>(`/`, config);
    return result;
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

  async create(data: DeepPartial<T>, config: RequestConfig = {}): Promise<T> {
    const result = await this.client.post<T, DeepPartial<T>>(`/`, data, config);
    return result;
  }

  async update(
    id: TKey,
    data: DeepPartial<T>,
    config: RequestConfig = {}
  ): Promise<T> {
    const result = await this.client.put<T, DeepPartial<T>>(
      `/${id}`,
      data,
      config
    );
    return result;
  }

  async partialUpdate(
    id: TKey,
    data: DeepPartial<T>,
    config: RequestConfig = {}
  ): Promise<T> {
    const result = await this.client.patch<T, DeepPartial<T>>(
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
