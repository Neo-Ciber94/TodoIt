import withRoutes from "@lib/api/withRoutes";
import { TodoRepository } from "@lib/repositories/todo.repository";
import { getPagination } from "@lib/repositories/utils";
import { Validate } from "@lib/utils/validate";

const BASE_PATH = "/api/todos";
const todos = new TodoRepository();

export default withRoutes({ attachParams: true })
  // GET - /api/todos
  .get(BASE_PATH, async (req, res) => {
    const pagination = getPagination(req);
    const result = await todos.findWithPagination(pagination);
    return res.json(result);
  })

  // GET - /api/todos/:id
  .get(BASE_PATH + "/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const result = await todos.findById(id);
    return res.json(result);
  })

  // POST - /api/todos
  .post(BASE_PATH, async (req, res) => {
    const { title, content } = req.body;
    Validate.isRequired(title, "title");

    const result = await todos.create({ title, content });
    return res.json(result);
  })

  // PUT - /api/todos/:id
  .put(BASE_PATH + "/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content, completed } = req.body;

    if (completed) {
      Validate.isBoolean(completed, "completed");
    }

    const result = await todos.update(id, { title, content, completed });
    return res.json(result);
  })

  // DELETE - /api/todos/:id
  .delete(BASE_PATH + "/:id", async (req, res) => {
    const { id } = req.params;
    const result = await todos.delete(id);
    return res.json(result);
  });
