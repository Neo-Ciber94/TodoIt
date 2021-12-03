import { Drawer, List, ListItem, ListItemText } from "@mui/material";

export interface TodosFiltersProps {
  open: boolean;
  onClose: () => void;
  onFilters: (filters: TodosFilters) => void;
}

export enum TodoState {
  Any, Completed, Incompleted
}

export interface TodosFilters {
  todos: TodoState;
  colors: string[];
  tags: string[];
}

export const TodosFiltersDrawer: React.FC<TodosFiltersProps> = ({
  open,
  onClose,
  ...rest
}) => {
  return (
    <Drawer anchor={"left"} open={open} onClose={onClose}>
      <List>
        <ListItem button onClick={() => {}}>
          <ListItemText primary="All" />
        </ListItem>
        <ListItem button onClick={() => {}}>
          <ListItemText primary="Active" />
        </ListItem>
        <ListItem button onClick={() => {}}>
          <ListItemText primary="Completed" />
        </ListItem>
      </List>
    </Drawer>
  );
};
