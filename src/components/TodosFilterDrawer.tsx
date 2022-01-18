import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";

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
  const setCompleted = (completed: boolean | undefined) => {
    const newFilters = { ...filters, completed };
    completed ?? delete newFilters.completed;
    setFilters(newFilters);
  };

  return (
    <Drawer
      anchor={"left"}
      open={open}
      onBackdropClick={onClose}
      PaperProps={{ className: "bg-black w-1/2 md:w-1/3 pt-10 pl-3" }}
    >
      <List>
        <ListItem button onClick={() => setCompleted(undefined)}>
          <Filter1Icon className="text-white mr-3" />
          <ListItemText className="text-white text-4xl" primary="All" />
        </ListItem>
        <ListItem button onClick={() => setCompleted(false)}>
          <Filter2Icon className="text-white mr-3" />
          <ListItemText className="text-white text-4xl" primary="Active" />
        </ListItem>
        <ListItem button onClick={() => setCompleted(true)}>
          <Filter3Icon className="text-white mr-3" />
          <ListItemText className="text-white text-4xl" primary="Completed" />
        </ListItem>
      </List>
    </Drawer>
  );
};
