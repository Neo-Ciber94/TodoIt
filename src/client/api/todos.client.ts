import { PageResult } from "@lib/repositories/base/repository";
import { ITodo } from "src/shared/todo.model";
import { API_URL } from "../constants";
import { ApiClient } from "./api.client";

export class TodoApiClient extends ApiClient<ITodo, string> {
  constructor() {
    super(API_URL + "/todos");
  }

  search(
    page: number,
    pageSize: number,
    search: string = ""
  ): Promise<PageResult<ITodo>> {
    return this.client.get(`/`, {
      params: {
        page,
        pageSize,
        search,
      },
    });
  }
}
