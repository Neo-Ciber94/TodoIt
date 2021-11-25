import { PageResult } from "@server/repositories/base/repository";
import { AxiosRequestConfig } from "axios";
import { ITodo } from "src/shared/models/todo.model";
import { API_URL } from "../constants";
import { BaseApiClient, QueryOptions } from "./base.client";

export type QueryTodosOptions = QueryOptions & { search?: string };

export class TodoApiClient extends BaseApiClient<ITodo, string> {
  constructor() {
    super(API_URL + "/todos");
  }

  async toggle(id: string, config: AxiosRequestConfig<ITodo> = {}) {
    const result = await this.client.post<ITodo>(`/${id}/toggle`, null, config);
    return result.data;
  }

  async search(
    options: QueryTodosOptions,
    config: AxiosRequestConfig<ITodo> = {}
  ): Promise<PageResult<ITodo>> {
    const search = options.search || "";
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;

    const result = await this.client.get<PageResult<ITodo>>(`/`, {
      ...config,
      params: {
        page,
        pageSize,
        search,
      },
    });

    return result.data;
  }
}
