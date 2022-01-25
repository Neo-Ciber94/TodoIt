import { ITag, ITagInput } from "@shared/models/tag.model";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomDialog } from "./CustomDialog";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import {
  ListItem,
  IconButton,
  Button,
  ListItemText,
  Box,
  CircularProgress,
} from "@mui/material";
import { CustomTextField } from "./CustomTextField";
import { TransitionGroup } from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import { nanoid } from "nanoid";
import { services } from "src/client/services";

type ITagModel = Pick<ITag, "name"> & {
  id: string;
};

export interface TagEditorDialogProps {
  title?: string;
  open: boolean;
  initialTags: ITagModel[] | undefined;
  handleClose: () => void;
}

export const TagEditorDialog = (props: TagEditorDialogProps) => {
  const { title = "Tags", open, initialTags, handleClose } = props;
  const createdTags = useRef<ITagModel[]>([]);
  const deletedTags = useRef<Set<string>>(new Set());
  const updatedTags = useRef<Set<ITagModel>>(new Set());

  const handleCreate = (tag: ITagModel) => {
    createdTags.current.push(tag);
  };

  const handleUpdate = (tag: ITagModel) => {
    updatedTags.current.add(tag);
  };

  const handleDelete = (tag: ITagModel) => {
    deletedTags.current.add(tag.id);
  };

  const handleSave = async () => {
    const toCreate: ITagInput[] = createdTags.current.map((tag) => ({
      ...tag,
    }));

    toCreate.forEach((tag) => {
      tag.id = undefined;
    });

    const toUpdate = Array.from(updatedTags.current);
    const toDelete = Array.from(deletedTags.current);

    await services.tags.bulkOperation({
      insert: [...toCreate, ...toUpdate],
      delete: toDelete,
    });

    handleClose();
  };

  // const ListContent = () => {
  //   if (initialTags == null) {
  //     return <CircularProgress sx={{ color: "white" }} />;
  //   }

  //   return (
  //     <>
  //       <CreateTagTextField
  //         tagName={searchText}
  //         setTagName={handleSearch}
  //         canCreate={displayedTags.length === 0 && searchText.length > 0}
  //         onCreate={handleCreate}
  //       />
  //       <TransitionGroup>
  //         {displayedTags.map((tag) => (
  //           <Collapse key={tag.id}>
  //             <EditableTag
  //               key={tag.id}
  //               tag={tag}
  //               onDelete={handleDelete}
  //               onEdit={handleUpdate}
  //             />
  //           </Collapse>
  //         ))}
  //       </TransitionGroup>
  //     </>
  //   );
  // };

  return (
    <CustomDialog
      open={open}
      title={title}
      handleClose={handleClose}
      Icon={LocalOfferIcon}
    >
      <ListContent
        initialTags={initialTags}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <div className="flex flex-row gap-2 mt-4">
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
};

interface ListConcentProps {
  initialTags: ITagModel[] | undefined;
  onCreate: (tag: ITagModel) => void;
  onUpdate: (tag: ITagModel) => void;
  onDelete: (tag: ITagModel) => void;
}

const ListContent = (props: ListConcentProps) => {
  const { initialTags, onCreate, onUpdate, onDelete } = props;
  const [searchText, setSearchText] = useState("");
  const [tags, setTags] = useState<ITagModel[]>([]);
  const [displayedTags, setDisplayedTags] = useState<ITagModel[]>([]);

  useEffect(() => {
    setTags(initialTags || []);
    setDisplayedTags(initialTags || []);
  }, [initialTags]);

  const handleCreate = (tag: ITagModel) => {
    const newTag = { id: tag.id, name: tag.name };
    const newTags = [...tags, newTag];

    onCreate(tag);
    setTags(newTags);
    setDisplayedTags(newTags);
  };

  const handleDelete = (tag: ITagModel) => {
    const newTags = tags.filter((t) => t.id !== tag.id);
    const newDisplayedTags = displayedTags.filter((t) => t.id !== tag.id);

    onDelete(tag);
    setTags(newTags);
    setDisplayedTags(newDisplayedTags);
  };

  const handleSearch = (s: string) => {
    if (s.trim().length === 0) {
      setDisplayedTags(tags);
    } else {
      setDisplayedTags(
        tags.filter((t) =>
          t.name.toLowerCase().trim().includes(s.toLowerCase().trim())
        )
      );
      setSearchText(s);
    }
  };

  if (initialTags == null) {
    return <CircularProgress sx={{ color: "white" }} />;
  }

  return (
    <>
      <CreateTagTextField
        tagName={searchText}
        setTagName={handleSearch}
        canCreate={displayedTags.length === 0 && searchText.length > 0}
        onCreate={handleCreate}
      />
      <TransitionGroup>
        {displayedTags.map((tag) => (
          <Collapse key={tag.id}>
            <EditableTag
              key={tag.id}
              tag={tag}
              onDelete={handleDelete}
              onEdit={onUpdate}
            />
          </Collapse>
        ))}
      </TransitionGroup>
    </>
  );
};

interface EditableTagProps {
  tag: ITagModel;
  onDelete: (tag: ITagModel) => void;
  onEdit: (tag: ITagModel) => void;
}

function EditableTag({ tag, onDelete, onEdit }: EditableTagProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tagName, setTagName] = useState(tag.name);
  const [editTagName, setEditTagName] = useState(tagName);

  const handleEditTagName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setEditTagName(text);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleConfirmEdit = () => {
    onEdit({ ...tag, name: editTagName });
    setTagName(editTagName);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTagName(tagName);
  };

  const Actions = useCallback(
    () => (
      <div>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={handleStartEditing}
          sx={{ marginRight: 0.5 }}
        >
          <EditIcon sx={{ color: "white" }} />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(tag)}
        >
          <DeleteIcon sx={{ color: "white" }} />
        </IconButton>
      </div>
    ),
    [onDelete, tag]
  );

  const EditingActions = useCallback(
    () => (
      <div>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={handleConfirmEdit}
          sx={{ marginRight: 0.5 }}
        >
          <SaveIcon sx={{ color: "white" }} />
        </IconButton>
        <IconButton edge="end" aria-label="cancel" onClick={handleCancelEdit}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <ListItem
      sx={{
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {isEditing ? (
        <CustomTextField
          sx={{ marginRight: "auto", width: "80%" }}
          value={editTagName}
          size="small"
          variant="standard"
          onChange={handleEditTagName}
        />
      ) : (
        <ListItemText primary={editTagName} sx={{ marginRight: "auto" }} />
      )}

      {isEditing ? <EditingActions /> : <Actions />}
    </ListItem>
  );
}

interface CreateTagTextFieldProps {
  canCreate: boolean;
  onCreate: (tag: ITagModel) => void;
  tagName: string;
  setTagName: (text: string) => void;
}

const CreateTagTextField: React.FC<CreateTagTextFieldProps> = ({
  canCreate,
  onCreate,
  tagName,
  setTagName,
}) => {
  const handleSetTagName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTagName(text);
  };

  const handleCreateTag = () => {
    const tag = { name: tagName, id: nanoid() };
    setTagName("");
    onCreate(tag);
  };

  return (
    <div className="flex flex-col gap-1">
      <CustomTextField
        sx={{ marginRight: "auto", width: "100%" }}
        variant="standard"
        value={tagName}
        autoComplete="off"
        onChange={handleSetTagName}
      />
      {canCreate && <CreateTagButton onClick={handleCreateTag} />}
    </div>
  );
};

interface CreateTagButtonProps {
  onClick: () => void;
}

function CreateTagButton({ onClick }: CreateTagButtonProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        mt: 2,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <AddIcon sx={{ marginRight: 1 }} />
      <span>Create New</span>
    </Box>
  );
}
