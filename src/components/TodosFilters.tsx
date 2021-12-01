import { Drawer, List, ListItem, ListItemText } from "@mui/material";

export interface TodosFiltersProps {
  open: boolean;
  onClose: () => void;
  selectedColors?: string[];
  onSelectColor?: (color: string) => void;
}

export const TodosFilters: React.FC<TodosFiltersProps> = ({
  open,
  ...rest
}) => {
  return (
    <Drawer anchor={"left"} open={open}>
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
