import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useTags } from "src/hooks/fetchers";
import React, { useCallback } from "react";

export interface TodoFilters {
  completed?: boolean;
  color?: string[];
  tags?: string;
}

export interface TodosFiltersProps {
  open: boolean;
  onClose: () => void;
  filters: TodoFilters;
  setFilters: (filters: TodoFilters) => void;
}

export const TodosFiltersDrawer: React.FC<TodosFiltersProps> = ({
  open,
  onClose,
  filters,
  setFilters,
}) => {
  const { data, error } = useTags();

  const setCompleted = (completed: boolean | undefined) => {
    const newFilters = { ...filters, completed };
    completed ?? delete newFilters.completed;
    setFilters(newFilters);
  };

  const setTag = (id: string | undefined) => {
    const newFilters = { ...filters };

    if (id === filters.tags) {
      delete newFilters.tags;
    } else {
      newFilters.tags = id;
      if (id == null) {
        delete newFilters.tags;
      }
    }

    setFilters(newFilters);
  };

  const isTagSelected = useCallback(
    (id: string) => {
      return filters.tags === id;
    },
    [filters.tags]
  );

  // @tailwind
  const pillStyle = `
    inline-flex flex-row justify-center items-center content-center 
    rounded-2xl font-normal leading-6 mr-2 w-full px-3 py-2 text-base
    `;

  const MoreButton = React.memo(function MoreButton() {
    return (
      <button
        className={`${pillStyle} bg-stone-700 hover:bg-stone-500 text-white`}
      >
        More...
      </button>
    );
  });

  const Content = () => {
    if (!data) {
      return (
        <div className="flex flex-row  w-full justify-center content-center p-1">
          <CircularProgress sx={{ color: "black" }} />
        </div>
      );
    }

    if (error) {
      const message = error.message || "Something went wrong";
      return <div className="text-red-500 text-xl">{message}</div>;
    }

    return (
      <div className="grid grid-cols-3 w-full gap-1 pb-5 pt-2">
        {data.map((tag, index) => (
          <button
            key={index}
            onClick={() => setTag(tag.id)}
            className={`${pillStyle} ${
              isTagSelected(tag.id) ? "bg-gray-800" : "bg-black"
            } hover:bg-gray-800 text-white`}
          >
            {tag.name}
          </button>
        ))}

        {/* TODO: Remove hardcoded value */}
        {data.length > 12 && <MoreButton />}
      </div>
    );
  };

  return (
    <Drawer
      anchor={"left"}
      open={open}
      onBackdropClick={onClose}
      keepMounted
      PaperProps={{
        sx: {
          backgroundColor: "#FED7AA",
          width: ["100%", "50%", "33%"],
        },
      }}
    >
      <List sx={{ paddingTop: 0, flexDirection: "column", height: "100%" }}>
        <ListItem
          onClick={onClose}
          className="bg-black cursor-pointer select-none flex flex-row"
        >
          <div className="text-white text-2xl p-2">Search Todos</div>

          <CloseOutlinedIcon className="ml-auto text-white text-3xl" />
        </ListItem>
        <div className="mt-3">
          <ListItem button onClick={() => setCompleted(undefined)}>
            <IndeterminateCheckBoxOutlinedIcon className="mr-3 text-[30px]" />
            <ListItemText className="p-1" primary="All" />
          </ListItem>
          <ListItem button onClick={() => setCompleted(false)}>
            <CheckBoxOutlineBlankOutlinedIcon className="mr-3 text-[30px]" />
            <ListItemText className="p-1" primary="Active" />
          </ListItem>
          <ListItem button onClick={() => setCompleted(true)}>
            <CheckBoxOutlinedIcon className="mr-3 text-[30px]" />
            <ListItemText className="p-1" primary="Completed" />
          </ListItem>
          <ListItem button onClick={() => {}}>
            <ColorLensIcon className="mr-3 text-[30px]" />
            <ListItemText className="p-1" primary="Color" />
          </ListItem>
        </div>
      </List>
      <Divider className="mx-2" />
      <List className="mt-auto">
        <ListItem>
          <div className="font-bold text-black text-xl">Tags</div>
        </ListItem>
        <ListItem>
          <Content />
        </ListItem>
      </List>
    </Drawer>
  );
};
