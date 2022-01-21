import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { ITag } from "@shared/models/tag.model";
import {
  AppBar,
  IconButton,
  SxProps,
  Checkbox,
  TextField,
  Toolbar,
  styled,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AddIcon from "@mui/icons-material/Add";
import { forwardRef, useEffect, useRef, useState } from "react";
import { grey } from "@mui/material/colors";
import { animated, useSpring } from "react-spring";

const TAGS: ITag[] = [
  "Programming",
  "Design",
  "Music",
  "Art",
  "Sports",
  "Other",
  "Business",
  "Finance",
  "Health",
  "Education",
  "Food",
].map(createTag);

function createTag(s: string, index: number): ITag {
  return {
    id: index.toString(),
    name: s,
    creatorUserId: "abc123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

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
  initialTags?: ITag[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface TransitionProps {
  children?: React.ReactElement;
  in: boolean;
  onEnter?: () => {};
  onExited?: () => {};
}

const Fade = forwardRef<HTMLDivElement, TransitionProps>(function Fade(
  props,
  ref
) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    config: { duration: 200 },
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

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
  initialTags = TAGS,
}: TagsModalProps) {
  const handleClose = () => setOpen(false);
  const [items, setItems] = useState(initialTags);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState(initialTags);
  const heightRef = useRef(200);
  const canCreate = items.length === 0 && search.length > 0;

  useEffect(() => {
    if (tags.length > 5) {
      heightRef.current = 300;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    if (search.length > 0) {
      const newTags = [...tags, createTag(search, tags.length)];
      setTags(newTags);
      setItems(newTags);
      setSearch("");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value || "";
    setSearch(text);

    if (text.length > 0) {
      const tagsFound = tags.filter((tag) =>
        tag.name.trim().toLowerCase().includes(text.trim().toLowerCase())
      );
      setItems(tagsFound);
    } else {
      setItems(tags);
    }
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
      <Fade in={open}>
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
                value={search}
                onChange={handleSearch}
              />
            </Box>

            <Box sx={{ overflowY: "auto", height: heightRef.current }}>
              {canCreate && <CreateTagButton onClick={handleCreate} />}
              <Box>
                {items.map((tag) => (
                  <Tag key={tag.id} tag={tag} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

function Tag({ tag }: { tag: Partial<ITag> }) {
  const [checked, setChecked] = useState(false);

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
          onClick={() => setChecked(!checked)}
        />
        <span>{tag.name}</span>
      </div>

      <Box
        onClick={() => setChecked(!checked)}
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
