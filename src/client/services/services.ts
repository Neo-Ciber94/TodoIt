import { TagApiService } from "./tag.service";
import { TodoApiService } from "./todos.service";

export const services = {
  todos: new TodoApiService(),
  tags: new TagApiService(),
};
