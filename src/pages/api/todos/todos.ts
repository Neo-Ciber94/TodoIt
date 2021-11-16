import type { NextApiRequest, NextApiResponse } from "next";
import { Db } from "../../../db";
import Todo from "../../../db/models/todo.model";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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
  try {
    await Db.connect();
    const todos = Todo.find({});
    return res.json(todos);
  } finally {
    await Db.disconnect();
  }
}

async function createTodo(req: NextApiRequest, res: NextApiResponse) {
  const title = req.body.title?.trim();
  const content = req.body.content?.trim();

  try {
    await Db.connect();
    if (title == null || title.trim().length === 0) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const newTodo = new Todo({ title, content, completed: false });

    newTodo.save();
    return res.json(newTodo);
  } finally {
    await Db.disconnect();
  }
}

function updateTodo(req: NextApiRequest, res: NextApiResponse) {}

function deleteTodo(req: NextApiRequest, res: NextApiResponse) {}
