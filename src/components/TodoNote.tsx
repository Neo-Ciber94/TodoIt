import { ITodo } from "src/shared/todo.model";
import * as React from "react";
import { Paper, Button } from "@mui/material";

export interface TodoNoteProps {
  todo: ITodo;
  height?: number;
  width?: number;
  onComplete: (todo: ITodo) => void;
}

export default function TodoNote({
  todo,
  height,
  width,
  onComplete,
}: TodoNoteProps) {
  height = height || 200;
  width = width || 200;

  return (
    <Paper
      className="bg-yellow-100 p-4 flex flex-col"
      sx={{
        width,
        height,
      }}
    >
      <h1 className="font-bold text-lg">{todo.title}</h1>
      <p>{todo.content}</p>
      <div className="flex flex-row justify-between mt-auto">
        <Button
          variant="contained"
          className={
            todo.completed
              ? `bg-blue-500 hover:bg-blue-600`
              : `bg-gray-500 hover:bg-gray-600`
          }
          onClick={() => onComplete(todo)}
        >
          {todo.completed ? "Complete" : "Uncompleted"}
        </Button>
        <Button variant="contained" color="error" onClick={() => {}}>
          Delete
        </Button>
      </div>
    </Paper>
  );
}
