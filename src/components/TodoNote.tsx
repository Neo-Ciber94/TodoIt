import { ITodo } from "src/shared/models/todo.model";
import * as React from "react";
import { Paper, Button, Checkbox } from "@mui/material";
import { useEffect } from "react";
import { TodoApiClient } from "src/client/api/todos.client";
import { useSwal } from "src/hooks/useSwal";
import Link from "next/link";

const todoClient = new TodoApiClient();

export interface TodoNoteProps {
  todo: ITodo;
  height?: number;
  width?: number;
  delayIndex?: number;
}

const CHECKBOX_LABEL = { inputProps: { "aria-label": "Checkbox demo" } };

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
      className={`py-2 px-4 flex flex-col opacity-0 cursor-pointer hover:brightness-200 ${color} ${
        isVisible ? "note-appear-anim" : ""
      }`}
      sx={{
        width,
        height,
      }}
    >
      <div className="flex flex-row justify-end">
        <Checkbox
          {...CHECKBOX_LABEL}
          checked={isCompleted}
          sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
          color="default"
          onClick={async () => {
            const result = await todoClient.partialUpdate(id, {
              completed: !isCompleted,
            });
            setIsCompleted(result.completed);
          }}
        />
      </div>
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
        <Link href={`/todos/edit/${id}`} passHref>
          <Button variant="contained">Edit</Button>
        </Link>
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
              },
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
