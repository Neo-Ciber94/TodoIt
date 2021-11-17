import type { NextApiRequest, NextApiResponse } from "next";
import withMongoDb from "../../../lib/db/mongodb/withMongoDb";
import Todo from "../../../lib/models/todo.schema";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return findTodos(req, res);
  }

  if (req.method === "POST") {
    return createTodo(req, res);
  }

  if (req.method === "PUT") {
    return updateTodo(req, res);
  }

  if (req.method === "DELETE") {
    return deleteTodo(req, res);
  }

  res.status(405).end();
}

async function findTodos(_: NextApiRequest, res: NextApiResponse) {
  const todos = await Todo.find({});
  console.log("Result: " + todos);
  return res.json(todos);
}

async function createTodo(req: NextApiRequest, res: NextApiResponse) {
  const title = req.body.title?.trim();
  const content = req.body.content?.trim();

  if (title == null || title.trim().length === 0) {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  const newTodo = await Todo.create({ title, content, completed: false });
  await newTodo.save();
  return res.json(newTodo);
}

function updateTodo(req: NextApiRequest, res: NextApiResponse) {}

function deleteTodo(req: NextApiRequest, res: NextApiResponse) {}

export default withMongoDb(handler);
