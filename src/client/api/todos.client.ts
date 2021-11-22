import { PageResult } from "@lib/repositories/base/repository";
import { ITodo } from "src/shared/todo.model";
import { API_URL } from "../constants";
import { RestApiClient, QueryOptions } from "./rest-api.client";

export type QueryTodosOptions = QueryOptions & { search?: string };

export class TodoApiClient extends RestApiClient<ITodo, string> {
  constructor() {
    super(API_URL + "/todos");
  }

  search(options: QueryTodosOptions): Promise<PageResult<ITodo>> {
    const search = options.search || "";
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;

    return this.client.get(`/`, {
      params: {
        page,
        pageSize,
        search,
      },
    });
  }
}
