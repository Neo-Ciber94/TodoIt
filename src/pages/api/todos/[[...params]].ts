import { withApi } from "@lib/core/withApi";
import { withRestApi } from "@lib/core/withRestApi";
import withRouteController from "@lib/core/withRouteController";
import { mongodb } from "@lib/db/mongodb/middleware";
import { TodoRepository } from "@lib/repositories/todo.repository";
import { Validate } from "@lib/utils/validate";
import morgan from "morgan";
import { NextApiRequest, NextApiResponse } from "next";

// export default withRestApi(new TodoRepository(), {
//   route: "/todos",
//   update: async (repo, req, res) => {
//     const { title, content, completed } = req.body;

//     if (completed) {
//       Validate.isBoolean(completed);
//     }

//     if (title) {
//       Validate.isNonBlankString(title);
//     }

//     if (content) {
//       Validate.isNonBlankString(content);
//     }

//     const id = req.params.id;
//     const todo = await repo.update(id, { title, content, completed });
//     return res.json(todo);
//   },
// });

export default withRouteController<
  NextApiRequest & { params: Record<string, string> },
  NextApiResponse
>()
  .use(mongodb())
  .use(morgan("dev"))
  .get("/api/todos/hello", () => "Hello")
  .get("/api/todos/hello/:name", (req) => `Hello ${req.params.name}`);
