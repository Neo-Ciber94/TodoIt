import { PageResult } from "@server/repositories/base/repository.base";
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
    // prettier-ignore
    const { page = 1, pageSize = 10, search = "" } = options;

    // prettier-ignore
    let params: Record<string, string | number | boolean> = {};

    if (page) {
      params.page = page;
    }

    if (pageSize) {
      params.pageSize = pageSize;
    }

    if (search) {
      params.search = search;
    }

    // Set the extra params
    params = {
      ...params,
      ...config.params,
    };

    const result = await this.client.get<PageResult<ITodo>>(`/`, {
      ...config,
      params,
    });

    return result;
  }
}