import { ITodo } from "src/shared/todo.model";
import * as React from "react";
import { Paper, Button } from "@mui/material";

export interface TodoNoteProps {
  todo: ITodo;
  height?: number;
  width?: number;
}

const COLORS = ["bg-yellow-100", "bg-green-100", "bg-red-100", "bg-blue-100", "bg-pink-100"]

export default function TodoNote({ todo, height, width }: TodoNoteProps) {
  height = height || 200;
  width = width || 200;

  const [isCompleted, setIsCompleted] = React.useState(todo.completed);
  const computedIndex = todo.id.charCodeAt(0) + todo.id.charCodeAt(todo.id.length - 1);
  const color = COLORS[computedIndex % COLORS.length];

  return (
    <Paper
      className={`p-4 flex flex-col ${color}`}
      sx={{
        width,
        height,
      }}
    >
      <h1 className={`font-bold text-lg font-mono ${isCompleted? "line-through opacity-40": ""}`}>{todo.title}</h1>
      <p className={`font-mono py-3 ${isCompleted? "line-through opacity-40": ""}`}>{todo.content}</p>
      <div className="flex flex-row justify-between mt-auto py-3">
        <Button
          variant="contained"
          className={
            isCompleted
            ? `bg-gray-500 hover:bg-gray-600`
            : `bg-blue-500 hover:bg-blue-600`
          }
          onClick={() => {
            fetch(`/api/todos/${todo.id}`, {
              method: "PUT",
              body: JSON.stringify(todo),
            }).then(() => {
              setIsCompleted(!isCompleted);
            });
          }}
        >
          {isCompleted ? "Done" : "Complete"}
        </Button>
        <Button variant="contained" color="error" onClick={() => {}}>
          Delete
        </Button>
      </div>
    </Paper>
  );
}
