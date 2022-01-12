import {
  getAccessToken,
  getSession,
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";
import authMiddleware from "@server/middlewares/auth";
import mongoDbMiddleware from "@server/middlewares/mongodb";
import {
  TodoPaginationOptions,
  TodoRepository,
} from "@server/repositories/todo.repository";
import { buildPaginationOptions } from "@server/repositories/utils";
import { AppApiContext } from "@server/types";
import { Validate } from "@server/utils/validate";
import { ITodo } from "@shared/models/todo.model";
import morgan from "morgan";
import { NextApiRequest, NextApiResponse } from "next";
import {
  Get,
  Post,
  Put,
  Delete,
  UseMiddleware,
  withController,
  OnError,
  Results,
  NextApiRequestWithParams,
} from "next-controllers";

@UseMiddleware(morgan("dev"), authMiddleware(), mongoDbMiddleware())
class TodoController {
  private readonly todoRepository = new TodoRepository();

  @Get("/")
  getAll({ request }: AppApiContext) {
    // prettier-ignore
    const options = buildPaginationOptions<ITodo>(request) as TodoPaginationOptions;

    if (request.query.search) {
      options.search = String(request.query.search);
    }

    const userId = request.userId;
    return this.todoRepository.search(options, userId);
  }

  @Get("/:id")
  get({ request }: AppApiContext) {
    const id = String(request.params.id);
    const userId = request.userId;
    return this.todoRepository.findById(id, userId);
  }

  @Post("/")
  create({ request }: AppApiContext) {
    const { title, content, color } = request.body;
    Validate.isNonBlankString(title);

    if (content) {
      Validate.isNonBlankString(content);
    }

    const creatorUserId = request.userId;
    return this.todoRepository.create({ title, content, color, creatorUserId });
  }

  @Put("/:id")
  patch({ request }: AppApiContext) {
    const { title, content, completed, color } = request.body;

    if (completed) {
      Validate.isBoolean(completed);
    }

    if (title) {
      Validate.isNonBlankString(title);
    }

    if (content) {
      Validate.isNonBlankString(content);
    }

    const id = String(request.params.id);
    const creatorUserId = request.userId;
    return this.todoRepository.update({
      id,
      creatorUserId,
      title,
      content,
      completed,
      color,
    });
  }

  @Post("/:id/toggle")
  async toggle({ request }: AppApiContext) {
    const id = String(request.params.id);
    const userId = request.userId;
    const todo = await this.todoRepository.findById(id, userId);

    if (todo == null) {
      return null;
    }

    return await todo.toggleComplete();
  }

  @Delete("/:id")
  async delete({ request }: AppApiContext) {
    const id = String(request.params.id);
    const userId = request.userId;
    const todo = await this.todoRepository.findById(id, userId);

    if (todo == null) {
      return null;
    }

    return this.todoRepository.delete(todo);
  }
}

export default withController(TodoController);
