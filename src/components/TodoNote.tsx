import { ITodo } from "src/shared/models/todo.model";
import * as React from "react";
import { Paper, Button } from "@mui/material";
import { useEffect } from "react";
import { TodoApiClient } from "src/client/api/todos.client";
import { useSwal } from "src/hooks/useSwal";

const todoClient = new TodoApiClient();

export interface TodoNoteProps {
  todo: ITodo;
  height?: number;
  width?: number;
  delayIndex?: number;
}

const COLORS = [
  "bg-yellow-100",
  "bg-green-100",
  "bg-red-100",
  "bg-blue-100",
  "bg-pink-100",
];

export default function TodoNote({
  todo,
  height,
  width,
  delayIndex,
}: TodoNoteProps) {
  height = height || 200;
  width = width || 200;

  const id = todo.id;
  const [isCompleted, setIsCompleted] = React.useState(todo.completed);
  const computedIndex = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  const color = COLORS[computedIndex % COLORS.length];
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const swal = useSwal();

  useEffect(() => {
    if (ref.current) {
      const index = delayIndex || 0;
      const delay = (index + 1) * 100;
      ref.current.style.setProperty("--delay", `${delay}ms`);
      setIsVisible(true);
    }
  }, [delayIndex, ref]);

  return (
    <Paper
      ref={ref}
      className={`p-4 flex flex-col opacity-0 ${color} ${
        isVisible ? "note-appear-anim" : ""
      }`}
      sx={{
        width,
        height,
      }}
    >
      <h1
        className={`font-bold text-lg font-mono ${
          isCompleted ? "line-through opacity-40" : ""
        }`}
      >
        {todo.title}
      </h1>
      <p
        className={`font-mono py-3 ${
          isCompleted ? "line-through opacity-40" : ""
        }`}
      >
        {todo.content}
      </p>
      <div className="flex flex-row justify-between mt-auto py-3">
        <Button
          variant="contained"
          className={
            isCompleted
              ? `bg-gray-500 hover:bg-gray-600`
              : `bg-blue-500 hover:bg-blue-600`
          }
          onClick={async () => {
            const result = await todoClient.partialUpdate(id, {
              completed: !isCompleted,
            });
            setIsCompleted(result.completed);
          }}
        >
          {isCompleted ? "Done" : "Complete"}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={async () => {
            const result = await swal.fire({
              title: "Delete Todo?",
              icon: "info",
              showCancelButton: true,
              customClass: {
                confirmButton: "bg-red-500 hover:bg-red-600",
              }
            });

            if (result.isConfirmed) {
              console.log("Deleted!!");
            }
          }}
        >
          Delete
        </Button>
      </div>
    </Paper>
  );
}
