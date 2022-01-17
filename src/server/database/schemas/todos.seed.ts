import { randomPastelColor } from "@shared/config";
import fs from "fs";
import path from "path";
import Todo from "./todo.schema";
import { TodoDocument } from "./todo.types";

export default async function seedTodos(
  userId: string,
  count: number = 100
): Promise<boolean> {
  const todosCount = await Todo.countDocuments();

  if (todosCount === 0) {
    const filePath = path.join(process.cwd(), "data/todos.json");
    const fileText = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileText) as TodoDocument[];

    for (const todo of takeRandom(data, count)) {
      todo.color = randomPastelColor();
      todo.creatorUserId = userId;
    }

    await Todo.insertMany(data);
    return true;
  }

  return false;
}

function takeRandom<T>(array: T[], count: number): T[] {
  const result: T[] = [];
  const copy = [...array];

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }

  return result;
}
