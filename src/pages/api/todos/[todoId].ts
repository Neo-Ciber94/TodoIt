import { NextApiRequest, NextApiResponse } from "next";
import Todo from "../../../db/models/todo.model";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const todoId = req.query.todoId;

    if (typeof todoId !== "string") {
      return res.status(400).json({
        error: "Expected a valid string",
      });
    }

    const _id = new ObjectId(todoId);
    const result = await Todo.findById(_id);

    if (result == null) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    return res.json(result);
  }

  res.status(405).end();
}
