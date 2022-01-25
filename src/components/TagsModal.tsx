import Box from "@mui/material/Box";
import { ITagInput } from "@shared/models/tag.model";
import {
  SxProps,
  Checkbox,
  TextField,
  styled,
  Button,
  CircularProgress,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useRef, useState } from "react";
import { grey } from "@mui/material/colors";
import { ITodo } from "@shared/models/todo.model";
import {
  selectCheckedTags,
  TodoTag,
  useTodoTagReducer,
} from "src/redux/todo-tags.redux";
import { SlideTransition } from "./transitions";
import React from "react";
import { useTags } from "src/hooks/fetchers";
import { CustomDialog } from "./CustomDialog";
import { CustomTextField } from "./CustomTextField";

export interface TagsModalProps {
  todo?: ITodo;
  // initialTags: ITag[];
  open: boolean;
  onSelectTags: (tags: ITagInput[]) => void;
  setOpen: (open: boolean) => void;
}

enum ModalMinHeight {
  sm = 100,
  md = 200,
  lg = 300,
}

export default function TagsModal({
  open,
  todo,
  setOpen,
  onSelectTags,
}: TagsModalProps) {
  const { data, error } = useTags();
  const [searchText, setSearchText] = useState("");
  const [state, dispacher] = useTodoTagReducer();
  const minHeightRef = useRef(ModalMinHeight.sm);
  const { displayedTags } = state;
  const canCreate = displayedTags.length === 0 && searchText.length > 0;

  // Sets the height of the modal content
  useEffect(() => {
    if (state.tags.length === 0) {
      minHeightRef.current = ModalMinHeight.sm;
    } else if (state.tags.length > 5) {
      minHeightRef.current = ModalMinHeight.lg;
    } else {
      minHeightRef.current = ModalMinHeight.md;
    }
  }, [state.tags.length]);

  // Init the tags with the todo tags
  useEffect(() => {
    if (data) {
      dispacher({ type: "todoTag/init", todo, tags: data });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todo, data]);

  const handleClose = () => {
    setOpen(false);
    setSearchText("");
    dispacher({ type: "todoTag/reset" });
  };

  const handleSave = () => {
    const selectedTodos = selectCheckedTags(state.tags);
    dispacher({ type: "todoTag/done" });
    setOpen(false);
    onSelectTags(selectedTodos);
    setSearchText("");
  };

  const handleCreate = () => {
    if (searchText.length > 0) {
      dispacher({ type: "todoTag/create", name: searchText });
      setSearchText("");
    }
  };

  const handleTagCheck = (tag: TodoTag, check: boolean) => {
    if (check) {
      dispacher({ type: "todoTag/check", id: tag.id });
    } else {
      dispacher({ type: "todoTag/uncheck", id: tag.id });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value || "";
    setSearchText(search);
    dispacher({ type: "todoTag/search", searchText: search });
  };

  const Content = () => {
    if (!data) {
      return <CircularProgress sx={{ color: "white" }} />;
    }

    if (error) {
      const errorMessage = error.message || "Something went wrong";
      return <h1>Error: {errorMessage}</h1>;
    }

    return (
      <>
        {canCreate && <CreateTagButton onClick={handleCreate} />}
        <Box>
          {displayedTags.map((tag) => (
            <Tag
              key={tag.id}
              tag={tag}
              isChecked={tag.checked}
              onCheck={handleTagCheck}
            />
          ))}
        </Box>
      </>
    );
  };

  return (
    <CustomDialog
      title="Test"
      open={open}
      handleClose={handleClose}
      Icon={LocalOfferIcon}
      Transition={SlideTransition}
    >
      <Box
        sx={{
          color: "white",
          paddingBottom: 2,
          px: 1,
        }}
      >
        <CustomTextField
          label="Tag Name"
          variant="standard"
          autoComplete="off"
          value={searchText}
          onChange={handleSearch}
          sx={{
            width: "100%",
          }}
        />
      </Box>

      <Box
        sx={{
          overflowY: "auto",
          minHeight: minHeightRef.current,
          maxHeight: ModalMinHeight.lg,
        }}
      >
        <Content />
      </Box>

      <div className="flex flex-row gap-2">
        <Button
          variant="text"
          sx={{
            marginLeft: "auto",
            color: "white",
            fontWeight: 500,
            width: 100,
          }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="text"
          sx={{
            color: "red",
            fontWeight: 500,
            width: 100,
          }}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </div>
    </CustomDialog>
  );
}

interface TagProps {
  tag: TodoTag;
  isChecked: boolean;
  onCheck: (tag: TodoTag, check: boolean) => void;
}

function Tag({ tag, isChecked, onCheck }: TagProps) {
  const [checked, setChecked] = useState(isChecked);

  const handleChecked = () => {
    onCheck(tag, !checked);
    setChecked(!checked);
  };

  return (
    <Box
      sx={{
        "&:hover": {
          backgroundColor: "rgba(20, 20, 20, 0.5)",
          borderRadius: 2,
        },
        py: 1,
        px: 2,
        display: "flex",
        flex: "row",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Checkbox
          sx={{
            color: grey[500],
            "&.Mui-checked": {
              color: grey[200],
            },
          }}
          checked={checked}
          onClick={handleChecked}
        />
        <span>{tag.name}</span>
      </div>

      <Box
        onClick={handleChecked}
        sx={{
          cursor: "pointer",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          placeItems: "center",
        }}
      >
        {checked ? <LocalOfferIcon /> : <LocalOfferOutlinedIcon />}
      </Box>
    </Box>
  );
}

interface CreateTagButtonProps {
  onClick: () => void;
}

function CreateTagButton({ onClick }: CreateTagButtonProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        py: 2,
        px: 3,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(20, 20, 20, 0.5)",
          borderRadius: 2,
        },
      }}
    >
      <AddIcon sx={{ marginRight: 1 }} />
      <span>Create New</span>
    </Box>
  );
}
