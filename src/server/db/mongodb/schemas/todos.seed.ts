import { randomPastelColor } from "@shared/config";
import fs from "fs";
import path from "path";
import { connectMongoDb } from "../connectMongoDb";
import Todo from "./todo.schema";
import { TodoDocument } from "./todo.types";

export default async function seedTodos(): Promise<boolean> {
  const count = await Todo.countDocuments();

  if (count === 0) {
    const filePath = path.join(process.cwd(), "data/todos.json");
    const fileText = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileText) as TodoDocument[];

    for (const todo of data) {
      todo.color = randomPastelColor();
    }

    await Todo.insertMany(data);
    return true;
  }

  return false;
}
