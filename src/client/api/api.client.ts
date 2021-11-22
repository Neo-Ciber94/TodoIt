import { PageResult } from "@lib/repositories/base/repository";
import axios, { Axios } from "axios";

export class ApiClient<T, TKey> {
  protected readonly client: Axios;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  getAll(page: number, pageSize: number): Promise<PageResult<T>> {
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
