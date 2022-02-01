import { randomPastelColor } from "@shared/config";
import fs from "fs";
import path from "path";
import Todo from "./todo.schema";
import { TodoDocument } from "./todo.types";
import User from "./user.schema";

// Number of todos to create by default, for test purposes.
const SAMPLE_TODOS_COUNT = 23;

export default async function seedTodos(
  userId: string,
  count: number = SAMPLE_TODOS_COUNT
): Promise<boolean> {
  const user = await User.findOne({ userId });

  if (user == null) {
    return false;
  }

  if (user.isInitialized) {
    return true;
  }

  const todosCount = await Todo.count({ creatorUserId: userId });

  if (todosCount === 0) {
    const filePath = path.join(process.cwd(), "data/todos.json");
    const fileText = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileText) as TodoDocument[];
    const todos = takeRandom(data, count);

    for (const todo of todos) {
      todo.color = randomPastelColor();
      todo.creatorUserId = userId;
    }

    await Todo.insertMany(todos);
    user.isInitialized = true;
    await user.save();
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
