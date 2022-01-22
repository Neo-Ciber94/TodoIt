import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { ITag, ITagInput } from "@shared/models/tag.model";
import {
  AppBar,
  IconButton,
  SxProps,
  Checkbox,
  TextField,
  Toolbar,
  styled,
  Button,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useReducer, useRef, useState } from "react";
import { grey } from "@mui/material/colors";
import { ITodo } from "@shared/models/todo.model";
import {
  todoTagsReducer,
  createTodoTagsInitialState,
  selectTodoTags,
  TodoTag,
} from "src/redux/todo-tags.reducer";
import { FadeTransition } from "./transitions";

const TagSearchField = styled(TextField)({
  width: "100%",
  "& input.MuiInput-input": {
    color: "white",
  },
  "& label.MuiInputLabel-root": {
    color: "white",
  },
  "& div.MuiInput-underline.MuiInput-root:before": {
    borderBottomColor: "gray",
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
});

export interface TagsModalProps {
  todo?: ITodo;
  initialTags: ITag[];
  open: boolean;
  onSelectTags: (tags: ITagInput[]) => void;
  setOpen: (open: boolean) => void;
}

const tagSx: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: 3,
  overflow: "hidden",
  color: "white",
  boxShadow: 24,
  width: "90%",
};

export default function TagsModal({
  open,
  setOpen,
  onSelectTags,
  todo,
  initialTags,
}: TagsModalProps) {
  const [searchText, setSearchText] = useState("");
  const [state, dispacher] = useReducer(
    todoTagsReducer,
    createTodoTagsInitialState(todo, initialTags)
  );
  const heightRef = useRef(200);
  const { displayedTags } = state;
  const canCreate = displayedTags.length === 0 && searchText.length > 0;

  // Sets the height of the modal content
  useEffect(() => {
    if (state.tags.length > 5) {
      heightRef.current = 300;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setOpen(false);
    dispacher({ type: "todoTag/reset" });
  };

  const handleSave = () => {
    const selectedTodos = selectTodoTags(state.tags);
    onSelectTags(selectedTodos);
    handleClose();
  };

  const handleCreate = () => {
    if (searchText.length > 0) {
      dispacher({ type: "todoTag/create", name: searchText });
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

  return (
    <Modal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <FadeTransition in={open}>
        <Box sx={tagSx}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
              >
                <LocalOfferIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Tags
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              padding: 2,
              backgroundColor: "rgb(31, 31, 31)",
            }}
          >
            <Box
              sx={{
                color: "white",
                paddingBottom: 2,
                px: 1,
              }}
            >
              <TagSearchField
                label="Tag Name"
                variant="standard"
                autoComplete="off"
                value={searchText}
                onChange={handleSearch}
              />
            </Box>

            <Box sx={{ overflowY: "auto", height: heightRef.current }}>
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
          </Box>
        </Box>
      </FadeTransition>
    </Modal>
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
