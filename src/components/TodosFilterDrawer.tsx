import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";
import { useState } from "react";

export interface TodosFiltersProps {
  open: boolean;
  onClose: () => void;
  onFilters: (filters: TodosFilters) => void;
}

export enum TodoState {
  Any,
  Active,
  Completed,
}

export interface TodosFilters {
  state?: TodoState;
  colors?: string[];
  tags?: string[];
}

export const TodosFiltersDrawer: React.FC<TodosFiltersProps> = ({
  open,
  onClose,
  onFilters,
}) => {
  const setTodoState = (state: TodoState) => {
    onFilters({
      ...onFilters,
      state,
    });
  };

  return (
    <Drawer
      anchor={"left"}
      open={open}
      onBackdropClick={onClose}
      PaperProps={{ className: "bg-black w-1/2 md:w-1/3 pt-10 pl-3" }}
    >
      <List>
        <ListItem button onClick={() => setTodoState(TodoState.Any)}>
          <Filter1Icon className="text-white mr-3" />
          <ListItemText className="text-white text-4xl" primary="All" />
        </ListItem>
        <ListItem button onClick={() => setTodoState(TodoState.Active)}>
          <Filter2Icon className="text-white mr-3" />
          <ListItemText className="text-white text-4xl" primary="Active" />
        </ListItem>
        <ListItem button onClick={() => setTodoState(TodoState.Completed)}>
          <Filter3Icon className="text-white mr-3" />
          <ListItemText className="text-white text-4xl" primary="Completed" />
        </ListItem>
      </List>
    </Drawer>
  );
};
