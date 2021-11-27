import { ITodo } from "src/shared/models/todo.model";
import * as React from "react";
import {
  Paper,
  Box,
  IconButton,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export interface TodoNoteProps {
  todo: ITodo;
  height?: number | string;
  width?: number | string;
  delayIndex?: number;
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
  onDelete,
  onToggle,
  onClick,
}: TodoNoteProps) {
  height = height || "auto";
  width = width || 200;

  const [isCompleted, setIsCompleted] = React.useState(todo.completed);
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = !!anchorEl;

  useEffect(() => {
    if (ref.current) {
      const index = delayIndex || 0;
      const delay = (index + 1) * 100;
      ref.current.style.setProperty("--delay", `${delay}ms`);
      setIsVisible(true);
    }
  }, [delayIndex, ref]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleOnDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(todo);
  };

  return (
    <Paper
      ref={ref}
      className={`py-2 px-4 flex flex-col opacity-0 cursor-pointer ${
        isVisible ? "note-appear-anim" : ""
      }`}
      sx={{ width, height, backgroundColor: todo.color }}
      onClick={() => {
        if (onClick) {
          onClick(todo);
        }
      }}
    >
      <div className="flex flex-row justify-between">
        <Checkbox
          {...CHECKBOX_LABEL}
          checked={isCompleted}
          sx={{ "& .MuiSvgIcon-root": { fontSize: 25 } }}
          color="default"
          onClick={async (e) => {
            e.stopPropagation();
            const result = await onToggle(todo);
            setIsCompleted(result.completed);
          }}
        />

        <IconButton onClick={handleClick}>
          <MoreVertIcon sx={{ fontSize: 25 }} />
        </IconButton>
        <TodoMenu
          anchorEl={anchorEl}
          open={open}
          handleClose={handleClose}
          handleOnDelete={handleOnDelete}
        />
      </div>
      <Box className="my-8">
        <TodoNoteTitle isCompleted={isCompleted} title={todo.title} />
        {matches && (
          <TodoNoteContent isCompleted={isCompleted} content={todo.content} />
        )}
      </Box>
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
      className={`font-mono line-clamp-10 break-words ${
        isCompleted ? "line-through opacity-40" : ""
      }`}
    >
      {content}
    </p>
  );
}

interface TodoMenuProps {
  anchorEl: Element | null;
  open: boolean;
  handleOnDelete: (e: React.MouseEvent) => void;
  handleClose: (e: React.MouseEvent) => void;
}

function TodoMenu({
  anchorEl,
  open,
  handleClose,
  handleOnDelete,
}: TodoMenuProps) {
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={handleOnDelete}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        Delete
      </MenuItem>
    </Menu>
  );
}
