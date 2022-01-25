import { ITag } from "@shared/models/tag.model";
import { useCallback, useRef, useState } from "react";
import { CustomDialog } from "./CustomDialog";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { ListItem, IconButton, Button, ListItemText } from "@mui/material";
import { CustomTextField } from "./CustomTextField";

export interface TagEditorDialogProps {
  title?: string;
  open: boolean;
  tags: ITag[];
  handleClose: () => void;
}

export const TagEditorDialog = (props: TagEditorDialogProps) => {
  const { title = "Tags", open, tags, handleClose } = props;
  const deletedTags = useRef<Set<string>>(new Set());
  const updatedTags = useRef<Set<ITag>>(new Set());

  const handleDelete = (tag: ITag) => {
    console.log("DELETED: ", tag.name);
    deletedTags.current.add(tag.id);
  };

  const handleUpdate = (tag: ITag) => {
    console.log("UPDATED: ", tag.name);
    updatedTags.current.add(tag);
  };

  const handleSave = () => {
    console.log("Saving");
    // Bulk delete and Bulk update
    handleClose();
  };

  return (
    <CustomDialog
      open={open}
      title={title}
      handleClose={handleClose}
      Icon={LocalOfferIcon}
    >
      {tags.map((tag) => (
        <EditableTag
          key={tag.id}
          tag={tag}
          onDelete={handleDelete}
          onEdit={handleUpdate}
        />
      ))}

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

interface EditableTagProps {
  tag: ITag;
  onDelete: (tag: ITag) => void;
  onEdit: (tag: ITag) => void;
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
