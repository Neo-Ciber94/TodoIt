import {
  SwipeableDrawer,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  SxProps,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useTags } from "src/hooks/fetchers";
import React, { useCallback } from "react";
import { ColorPickerDialog } from "./ColorPickerDialog";
import { PASTEL_COLORS } from "@shared/config";
import { AsBoolean } from "@shared/types";
import { noop } from "@shared/utils";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ToggleableFilters = {
  active: "Active",
  completed: "Completed",
  color: "Color",
} as const;

type ActiveFilters = AsBoolean<typeof ToggleableFilters>;

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
  const theme = useTheme();
  const mdMatches = useMediaQuery(theme.breakpoints.down("sm"));
  const { data, error } = useTags();
  const [colorsDialogOpen, setColorsDialogOpen] = React.useState(false);
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilters>({
    active: false,
    completed: false,
    color: false,
  });

  const clearFilters = () => {
    const changed = Object.keys(filters).length > 0;
    setFilters({});
    setSelectedColors([]);

    setActiveFilters((s) => {
      const newState = { ...s };
      Object.keys(newState).forEach((key) => {
        newState[key as keyof ActiveFilters] = false;
      });
      return newState;
    });

    if (changed) {
      //onClose();
    }
  };

  const setCompleted = () => {
    const changed = filters.completed == null || filters.completed === false;
    const newFilters = { ...filters, completed: true };
    setFilters(newFilters);
    setActiveFilters({ ...activeFilters, completed: true, active: false });

    if (changed) {
      //onClose();
    }
  };

  const setActive = () => {
    const changed = filters.completed == null || filters.completed === true;
    const newFilters = { ...filters, completed: false };
    setFilters(newFilters);
    setActiveFilters({ ...activeFilters, completed: false, active: true });

    if (changed) {
      //onClose();
    }
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
    //onClose();
  };

  const isTagSelected = useCallback(
    (id: string) => {
      return filters.tags === id;
    },
    [filters.tags]
  );

  const setColors = (colors: string[]) => {
    setSelectedColors(colors);

    if (colors.length === 0) {
      const newFilters = { ...filters };
      delete newFilters.color;
      setActiveFilters({ ...activeFilters, color: false });
      setFilters(newFilters);
    } else {
      setActiveFilters({ ...activeFilters, color: true });
      setFilters({ ...filters, color: colors });
    }
  };

  // @tailwind
  const pillStyle = `
    inline-flex flex-row justify-center items-center content-center 
    rounded-2xl font-normal leading-6 mr-2 w-full px-3 py-2 text-base
    `;

  const openColorPicker = () => {
    setColorsDialogOpen(true);
  };

  const closeColorPicker = () => {
    setColorsDialogOpen(false);
    //onClose();
  };

  const MoreButton = React.memo(function MoreButton() {
    return (
      <button
        className={`${pillStyle} bg-stone-700 hover:bg-stone-500 text-white`}
      >
        More...
      </button>
    );
  });

  const TagsFilter = () => {
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
      <div className="grid grid-cols-3 w-full gap-2 pb-5 pt-2">
        {data.map((tag, index) => (
          <button
            key={index}
            onClick={() => setTag(tag.id)}
            className={`${pillStyle} ${
              isTagSelected(tag.id)
                ? "bg-transparent text-black"
                : "bg-black hover:bg-gray-800"
            }  ring-2 ring-black text-white shadow-lg`}
          >
            {tag.name}
          </button>
        ))}

        {/* TODO: Remove hardcoded value */}
        {/* {data.length > 12 && <MoreButton />} */}
      </div>
    );
  };

  function Content() {
    return (
      <>
        <List sx={{ paddingTop: 0, flexDirection: "column", height: "100%" }}>
          <ListItem
            onClick={onClose}
            className="bg-black cursor-pointer select-none flex flex-row"
          >
            <div className="text-white text-2xl p-2">Search Todos</div>

            <CloseOutlinedIcon className="ml-auto text-white text-3xl" />
          </ListItem>
          <div className="mt-3">
            <TodoFilterItem
              onClick={clearFilters}
              label="All"
              Icon={IndeterminateCheckBoxOutlinedIcon}
            />
            <TodoFilterItem
              onClick={setActive}
              label="Active"
              selected={activeFilters.active}
              Icon={CheckBoxOutlineBlankOutlinedIcon}
            />
            <TodoFilterItem
              onClick={setCompleted}
              label="Completed"
              selected={activeFilters.completed}
              Icon={CheckBoxOutlinedIcon}
            />
            <TodoFilterItem
              onClick={openColorPicker}
              label="Color"
              selected={activeFilters.color}
              Icon={ColorLensIcon}
            />
          </div>
        </List>
        <Divider className="mx-2" />
        <List className="mt-auto">
          <ListItem>
            <div className="font-bold text-black text-xl">Tags</div>
          </ListItem>
          <ListItem>
            <TagsFilter />
          </ListItem>
        </List>
      </>
    );
  }

  const drawerProps = {
    open,
    onClose,
    transitionDuration: 500,
  };

  return (
    <>
      {mdMatches
        ? withSwipeableDrawer(Content, drawerProps)
        : withDrawer(Content, drawerProps)}

      <ColorPickerDialog
        open={colorsDialogOpen}
        colors={PASTEL_COLORS}
        selectedColors={selectedColors}
        setSelectedColors={setColors}
        onClose={closeColorPicker}
      />
    </>
  );

  // return (
  //   <>
  //     <Drawer
  //       anchor={"left"}
  //       open={open}
  //       onClose={onClose}
  //       onBackdropClick={onClose}
  //       transitionDuration={500}
  //       keepMounted
  //       PaperProps={{
  //         sx: {
  //           backgroundColor: "#FED7AA",
  //           width: ["100%", "50%", "33%"],
  //         },
  //       }}
  //     >
  //       <List sx={{ paddingTop: 0, flexDirection: "column", height: "100%" }}>
  //         <ListItem
  //           onClick={onClose}
  //           className="bg-black cursor-pointer select-none flex flex-row"
  //         >
  //           <div className="text-white text-2xl p-2">Search Todos</div>

  //           <CloseOutlinedIcon className="ml-auto text-white text-3xl" />
  //         </ListItem>
  //         <div className="mt-3">
  //           <TodoFilterItem
  //             onClick={clearFilters}
  //             label="All"
  //             Icon={IndeterminateCheckBoxOutlinedIcon}
  //           />
  //           <TodoFilterItem
  //             onClick={setActive}
  //             label="Active"
  //             selected={activeFilters.active}
  //             Icon={CheckBoxOutlineBlankOutlinedIcon}
  //           />
  //           <TodoFilterItem
  //             onClick={setCompleted}
  //             label="Completed"
  //             selected={activeFilters.completed}
  //             Icon={CheckBoxOutlinedIcon}
  //           />
  //           <TodoFilterItem
  //             onClick={openColorPicker}
  //             label="Color"
  //             selected={activeFilters.color}
  //             Icon={ColorLensIcon}
  //           />
  //         </div>
  //       </List>
  //       <Divider className="mx-2" />
  //       <List className="mt-auto">
  //         <ListItem>
  //           <div className="font-bold text-black text-xl">Tags</div>
  //         </ListItem>
  //         <ListItem>
  //           <TagsFilter />
  //         </ListItem>
  //       </List>
  //     </Drawer>

  //     <ColorPickerDialog
  //       open={colorsDialogOpen}
  //       colors={PASTEL_COLORS}
  //       selectedColors={selectedColors}
  //       setSelectedColors={setColors}
  //       onClose={closeColorPicker}
  //     />
  //   </>
  // );
};

interface TodoFilterItemProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
}

const TodoFilterItem = ({
  label,
  onClick,
  selected,
  Icon,
}: TodoFilterItemProps) => {
  const sx: SxProps = () => {
    if (selected === true) {
      return {
        color: "white",
        backgroundColor: "black",
        "&:hover": {
          backgroundColor: "black",
        },
      };
    }

    return {
      color: "black",
      backgroundColor: "transparent",
    };
  };

  return (
    <ListItem button onClick={onClick} sx={sx}>
      <Icon className="mr-3 text-[30px]" />
      <ListItemText className="p-1" primary={label} />
    </ListItem>
  );
};

interface WithDrawerProps {
  open: boolean;
  transitionDuration?: number;
  onClose: () => void;
}

function withDrawer(
  Component: React.ComponentType<any>,
  { transitionDuration, open, onClose }: WithDrawerProps
) {
  return (
    <Drawer
      anchor={"left"}
      open={open}
      onClose={onClose}
      onBackdropClick={onClose}
      transitionDuration={transitionDuration}
      keepMounted
      PaperProps={{
        sx: {
          backgroundColor: "#FED7AA",
          width: ["100%", "50%", "33%"],
        },
      }}
    >
      <Component />
    </Drawer>
  );
}

function withSwipeableDrawer(
  Component: React.ComponentType<any>,
  { transitionDuration, open, onClose }: WithDrawerProps
) {
  return (
    <SwipeableDrawer
      anchor={"left"}
      open={open}
      onOpen={noop}
      onClose={onClose}
      onBackdropClick={onClose}
      transitionDuration={transitionDuration}
      keepMounted
      PaperProps={{
        sx: {
          backgroundColor: "#FED7AA",
          width: ["100%", "50%", "33%"],
        },
      }}
    >
      <Component />
    </SwipeableDrawer>
  );
}
