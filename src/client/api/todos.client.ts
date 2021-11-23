import { PageResult } from "@server/repositories/base/repository";
import { AxiosRequestConfig } from "axios";
import { ITodo } from "src/shared/models/todo.model";
import { API_URL } from "../constants";
import { RestApiClient, QueryOptions } from "./rest-api.client";

export type QueryTodosOptions = QueryOptions & { search?: string };

export class TodoApiClient extends RestApiClient<ITodo, string> {
  constructor() {
    super(API_URL + "/todos");
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
