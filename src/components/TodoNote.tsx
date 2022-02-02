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
import { SxProps, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TransitionStatus } from "react-transition-group";
import { Transition } from "react-transition-group";
import { useModal } from "src/contexts/ModalContext";

export interface TodoNoteProps {
  todo: ITodo;
  height?: number | string;
  width?: number | string;
  delayIndex?: number;
  onClick?: (todo: ITodo) => void;
  onDelete: (todo: ITodo) => void;
  onToggle: (todo: ITodo) => Promise<ITodo> | ITodo;
}

const duration = 300;

const transitionStyles: Record<TransitionStatus, SxProps> = {
  unmounted: {},
  entering: { opacity: 1, transform: "translateY(30px)" },
  entered: { opacity: 1, transform: "translateY(30px)" },
  exiting: { opacity: 0, transform: "translateY(0px)" },
  exited: { opacity: 0, transform: "translateY(0px)" },
};

export default function TodoNote({
  todo,
  height = "auto",
  width = 200,
  delayIndex = 0,
  onDelete,
  onToggle,
  onClick,
}: TodoNoteProps) {
  const [isCompleted, setIsCompleted] = React.useState(todo.completed);
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const hasAppeared = React.useRef(false);
  const isMountedRef = React.useRef(true);
  const open = !!anchorEl;

  const { open: openModal } = useModal();

  useEffect(() => {
    const index = delayIndex || 0;
    const delay = (index + 1) * 100;

    setTimeout(() => {
      setIsVisible(true);
      hasAppeared.current = true;
    }, delay);

    return () => {
      isMountedRef.current = false;
    };
  }, [delayIndex]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openModal({
      title: "Delete Todo",
      onConfirm: () => {
        openModal({
          title: "Are you really sure?",
        });
      },
    });
    // setAnchorEl(e.currentTarget);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleOnDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setAnchorEl(null);
  };

  const handleDestroy = () => {
    if (!isVisible && hasAppeared.current) {
      setTimeout(() => {
        if (!isDeleted) {
          setIsDeleted(true);
          onDelete(todo);
        }
      }, duration);
    }
  };

  return (
    <Transition
      in={isVisible}
      timeout={duration}
      nodeRef={ref}
      unmountOnExit={false}
      addEndListener={handleDestroy}
    >
      {(state) => (
        <Paper
          ref={ref}
          className={`py-2 px-4 flex flex-col cursor-pointer`}
          sx={{
            width,
            height,
            backgroundColor: todo.color,
            opacity: 0,
            transition: `all ${duration}ms ease-in-out`,
            transform: "translateY(30px)",
            ...transitionStyles[state],
          }}
          onClick={() => {
            if (onClick) {
              onClick(todo);
            }
          }}
        >
          <div className="flex flex-row justify-between">
            <Checkbox
              checked={isCompleted}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 25,
                  color: "gray",
                  opacity: 0.7,
                },
              }}
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
              color={todo.color}
              anchorEl={anchorEl}
              open={open}
              handleClose={handleClose}
              handleOnDelete={handleOnDelete}
            />
          </div>
          <Box className="my-8">
            <TodoNoteTitle isCompleted={isCompleted} title={todo.title} />
            {matches && (
              <TodoNoteContent
                isCompleted={isCompleted}
                content={todo.content}
              />
            )}
          </Box>
        </Paper>
      )}
    </Transition>
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
      className={`font-mono line-clamp-6 break-words ${
        isCompleted ? "line-through opacity-40" : ""
      }`}
    >
      {content}
    </p>
  );
}

interface TodoMenuProps {
  anchorEl: Element | null;
  color: string;
  open: boolean;
  handleOnDelete: (e: React.MouseEvent) => void;
  handleClose: (e: React.MouseEvent) => void;
}

function TodoMenu({
  color,
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
      PaperProps={{ sx: { backgroundColor: color } }}
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
