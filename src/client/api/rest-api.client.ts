import { PageResult } from "@lib/repositories/base/repository";
import axios, { Axios } from "axios";

export interface QueryOptions {
  page?: number;
  pageSize?: number;
}

export class RestApiClient<T, TKey> {
  protected readonly client: Axios;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  getAll(options: QueryOptions = {}): Promise<PageResult<T>> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;

    return this.client.get(`/`, {
      params: {
        page,
        pageSize,
      },
    });
  }

  getById(id: TKey): Promise<T> {
    return this.client.get(`/${id}`);
  }

  create(item: Partial<T>): Promise<T> {
    return this.client.post(`/`, item);
  }

  update(id: TKey, item: Partial<T>): Promise<T> {
    return this.client.put(`/${id}`, item);
  }

  partialUpdate(id: TKey, item: Partial<T>): Promise<T> {
    return this.client.patch(`/${id}`, item);
  }
}
