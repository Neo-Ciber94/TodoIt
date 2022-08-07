import { TagApiService } from "./tag.service";
import { TodoApiService } from "./todos.service";

/**
 * A collection of the app services.
 */
export const services = {
  todos: new TodoApiService(),
  tags: new TagApiService(),
} as const;
