import { ITag, ITagInput } from "@shared/models/tag.model";
import { useCallback, useEffect, useState } from "react";
import { CustomDialog } from "./CustomDialog";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
import { ITagBulkOperationResult } from "@server/repositories/tag.repository";
import { useToast } from "src/hooks/useToast";
import React from "react";
import { useSet } from "src/hooks/useSet";
import { useArray } from "src/hooks/useArray";

type ITagModel = Pick<ITag, "name"> & {
  id: string;
};

export interface TagEditorDialogProps {
  title?: string;
  open: boolean;
  initialTags: ITagModel[] | undefined;
  handleClose: () => void;
  onDone?: (result: ITagBulkOperationResult) => void;
}

export const TagEditorDialog = (props: TagEditorDialogProps) => {
  const { title = "Tags", open, initialTags, handleClose, onDone } = props;
  const { error: showError } = useToast();
  const createdTags = useArray<ITagModel>([]);
  const deletedTags = useSet<string>(new Set());
  const updatedTags = useSet<ITagModel>(new Set());

  const reset = () => {
    createdTags.clear();
    deletedTags.reset();
    updatedTags.reset();
  };

  const handleCreate = (tag: ITagModel) => {
    createdTags.push(tag);
  };

  const handleUpdate = (tag: ITagModel) => {
    updatedTags.add(tag);
  };

  const handleDelete = (tag: ITagModel) => {
    deletedTags.add(tag.id);
  };

  const handleSave = async () => {
    const toCreate: ITagInput[] = createdTags.view.map((tag) => ({
      ...tag,
    }));

    toCreate.forEach((tag) => {
      tag.id = undefined;
    });

    const toUpdate = Array.from(updatedTags.items);
    const toDelete = Array.from(deletedTags.items);

    try {
      const result = await services.tags.bulkOperation({
        insert: [...toCreate, ...toUpdate],
        delete: toDelete,
      });

      onDone?.(result);
      handleClose();
      reset();
    } catch (e: any) {
      const message = e.message || "Something went wrong";
      showError(message);
    }
  };

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
  const canCreate = React.useMemo(
    () =>
      searchText.trim().length > 0 &&
      !displayedTags.some((t) => t.name == searchText),
    [displayedTags, searchText]
  );

  useEffect(() => {
    setTags(initialTags || []);
    setDisplayedTags(initialTags || []);
  }, [initialTags]);

  const handleCreate = () => {
    const tag = { id: nanoid(), name: searchText };
    const newTag = { id: tag.id, name: tag.name };
    const newTags = [...tags, newTag];

    onCreate(tag);
    setTags(newTags);
    setDisplayedTags(newTags);
    setSearchText("");
  };

  const handleDelete = (tag: ITagModel) => {
    const newTags = tags.filter((t) => t.id !== tag.id);
    const newDisplayedTags = displayedTags.filter((t) => t.id !== tag.id);

    onDelete(tag);
    setTags(newTags);
    setDisplayedTags(newDisplayedTags);
  };

  const handleSearch = (s: string) => {
    setSearchText(s);

    if (s.trim().length === 0) {
      setDisplayedTags(tags);
    } else {
      setDisplayedTags(
        tags.filter((t) =>
          t.name.toLowerCase().trim().includes(s.toLowerCase().trim())
        )
      );
    }
  };

  if (initialTags == null) {
    return <CircularProgress sx={{ color: "white" }} />;
  }

  return (
    <>
      <CreateTagTextField tagName={searchText} setTagName={handleSearch} />
      <TransitionGroup className="h-64 py-2 overflow-auto">
        <Collapse>
          {canCreate && <CreateTagButton onClick={handleCreate} />}
        </Collapse>
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
    setTagName(editTagName);
    setIsEditing(false);
    onEdit({ ...tag, name: editTagName });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTagName(tagName);
  };

  const handleOnLostFocus = () => {
    handleConfirmEdit();
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
      <IconButton edge="end" aria-label="cancel" onClick={handleCancelEdit}>
        <CloseIcon sx={{ color: "white" }} />
      </IconButton>
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
          autoFocus
          onBlur={handleOnLostFocus}
          onChange={handleEditTagName}
        />
      ) : (
        <ListItemText
          primary={editTagName}
          sx={{ marginRight: "auto" }}
          onClick={handleStartEditing}
        />
      )}

      {isEditing ? <EditingActions /> : <Actions />}
    </ListItem>
  );
}

interface CreateTagTextFieldProps {
  tagName: string;
  setTagName: (text: string) => void;
}

const CreateTagTextField: React.FC<CreateTagTextFieldProps> = ({
  tagName,
  setTagName,
}) => {
  const handleSetTagName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTagName(text);
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
