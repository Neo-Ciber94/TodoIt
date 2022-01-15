import { PageResult } from "@server/repositories/base/repository";
import { RequestConfig } from "src/client/http-client";
import { ITodo } from "src/shared/models/todo.model";
import { ApiService, PagingOptions } from "./api-service";

export type QueryTodosOptions = PagingOptions & { search?: string };

export class TodoApiService extends ApiService<ITodo, string> {
  constructor() {
    super("/todos");
  }

  async toggle(id: string, config: RequestConfig = {}) {
    const result = await this.client.post<ITodo>(`/${id}/toggle`, null, config);
    return result;
  }

  async search(
    options: QueryTodosOptions,
    config: RequestConfig = {}
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

    return result;
  }
}
