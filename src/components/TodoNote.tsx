import { ITodo } from "src/shared/todo.model";
import * as React from "react";
import { Paper, Button } from "@mui/material";

export interface TodoNoteProps {
  todo: ITodo;
  height?: number;
  width?: number;
}

export default function TodoNote({ todo, height, width }: TodoNoteProps) {
  height = height || 200;
  width = width || 200;

  const [isCompleted, setIsCompleted] = React.useState(todo.completed);

  return (
    <Paper
      className="bg-yellow-100 p-4 flex flex-col"
      sx={{
        width,
        height,
      }}
    >
      <h1 className="font-bold text-lg font-mono">{todo.title}</h1>
      <p className="font-mono py-3">{todo.content}</p>
      <div className="flex flex-row justify-between mt-auto py-3">
        <Button
          variant="contained"
          className={
            isCompleted
              ? `bg-blue-500 hover:bg-blue-600`
              : `bg-gray-500 hover:bg-gray-600`
          }
          onClick={() => {
            fetch(`/api/todos/${todo._id}`, {
              method: "PUT",
              body: JSON.stringify(todo),
            }).then(() => {
              todo.completed = !isCompleted;
              setIsCompleted(!isCompleted);
            });
          }}
        >
          {isCompleted ? "Complete" : "Uncompleted"}
        </Button>
        <Button variant="contained" color="error" onClick={() => {}}>
          Delete
        </Button>
      </div>
    </Paper>
  );
}
