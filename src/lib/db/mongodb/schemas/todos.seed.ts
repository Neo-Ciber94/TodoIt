import fs from "fs";
import path from "path";
import Todo from "./todo.schema";
import { TodoDocument } from "./todo.types";

export default async function seedTodos() : Promise<boolean> {
  const count = await Todo.countDocuments();

  if (count === 0) {
    const filePath = path.join(process.cwd(), "data/todos.json");
    const fileText = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileText) as TodoDocument[];
    await Todo.insertMany(data);
    return true;
  }

  return false;
}
