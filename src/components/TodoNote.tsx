import { ITodo } from "src/shared/models/todo.model";
import * as React from "react";
import { Paper, Button, Checkbox } from "@mui/material";
import { useEffect } from "react";
import { NavLink } from "./NavLink";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export interface TodoNoteProps {
  todo: ITodo;
  height?: number | string;
  width?: number | string;
  delayIndex?: number;
  colorClass?: string;
  onClick?: (todo: ITodo) => void;
  onDelete: (todo: ITodo) => void;
  onToggle: (todo: ITodo) => Promise<ITodo> | ITodo;
}

const CHECKBOX_LABEL = { inputProps: { "aria-label": "Checkbox demo" } };

export default function TodoNote({
  todo,
  height,
  width,
  delayIndex,
  colorClass,
  onDelete,
  onToggle,
  onClick,
}: TodoNoteProps) {
  height = height || "auto";
  width = width || 200;

  const id = todo.id;
  const [isCompleted, setIsCompleted] = React.useState(todo.completed);
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

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
      className={`py-2 px-4 flex flex-col opacity-0 cursor-pointer ${colorClass} ${
        isVisible ? "note-appear-anim" : ""
      }`}
      sx={{ width, height }}
      onClick={() => {
        if (onClick) {
          onClick(todo);
        }
      }}
    >
      <div className="flex flex-row justify-end">
        <Checkbox
          {...CHECKBOX_LABEL}
          checked={isCompleted}
          sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
          color="default"
          onClick={async () => {
            const result = await onToggle(todo);
            setIsCompleted(result.completed);
          }}
        />
      </div>
      <TodoNoteTitle isCompleted={isCompleted} title={todo.title} />
      <TodoNoteContent isCompleted={isCompleted} content={todo.content} />

      <div className="flex flex-row justify-between mt-auto py-3">
        <NavLink href={`/todos/edit/${id}`}>Edit</NavLink>
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(todo)}
        >
          Delete
        </Button>
      </div>
    </Paper>
  );
}

type TTodoNoteTitleProps = {
  isCompleted: boolean;
  title: string;
};

function TodoNoteTitle({ isCompleted, title }: TTodoNoteTitleProps) {
  return (
    <h1
      className={`font-bold text-lg font-mono ${
        isCompleted ? "line-through opacity-40" : ""
      }`}
    >
      {title}
    </h1>
  );
}

type TodoNoteContentProps = {
  isCompleted: boolean;
  content?: string;
};

function TodoNoteContent({ isCompleted, content }: TodoNoteContentProps) {
  return (
    <p
      className={`font-mono py-3 max-h-[200px] overflow-y-auto break-words ${
        isCompleted ? "line-through opacity-40" : ""
      }`}
    >
      {content}
    </p>
  );
}
