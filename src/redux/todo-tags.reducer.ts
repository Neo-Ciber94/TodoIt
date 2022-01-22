import { ITag, ITagInput } from "@shared/models/tag.model";
import { ITodo } from "@shared/models/todo.model";
import { nanoid } from "nanoid";

export interface TodoTag {
  id: string;
  new: boolean;
  checked: boolean;
  name: string;
}

export interface TodoTagState {
  tags: TodoTag[];
  displayedTags: TodoTag[];
  searchText: string;
}

export interface TodoTagActionCreate {
  type: "todoTag/create";
  name: string;
}

export interface TodoTagActionCheck {
  type: "todoTag/check";
  id: string;
}

export interface TodoTagActionUncheck {
  type: "todoTag/uncheck";
  id: string;
}

export interface TodoTagActionSearch {
  type: "todoTag/search";
  searchText: string;
}

export interface TodoTagActionReset {
  type: "todoTag/reset";
}

export type TodoTagAction =
  | TodoTagActionCreate
  | TodoTagActionCheck
  | TodoTagActionUncheck
  | TodoTagActionSearch
  | TodoTagActionReset;

export function todoTagsReducer(
  state: TodoTagState,
  action: TodoTagAction
): TodoTagState {
  switch (action.type) {
    case "todoTag/create":
      return handleTodoTagCreate(state, action);
    case "todoTag/check":
      return handleTodoTagCheck(state, action);
    case "todoTag/uncheck":
      return handleTodoTagCheck(state, action);
    case "todoTag/search":
      return handleTodoTagSearch(state, action);
    case "todoTag/reset":
      return handleTodoTagReset(state, action);
    default:
      return state;
  }
}

export function createTodoTagsInitialState(
  todo: ITodo | undefined,
  tags: ITag[]
): TodoTagState {
  const result: TodoTag[] = tags.map((tag) => ({
    id: tag.id,
    new: false,
    checked: false,
    name: tag.name,
  }));

  if (todo) {
    todo.tags.forEach((tag) => {
      const index = result.findIndex((todoTag) => todoTag.id === tag.id);
      if (index !== -1) {
        result[index].checked = true;
      }
    });
  }

  return {
    tags: result,
    displayedTags: result,
    searchText: "",
  };
}

export function selectTodoTags(tags: TodoTag[]): ITagInput[] {
  return tags
    .filter((tag) => tag.checked)
    .map((tag) => ({ id: tag.new ? undefined : tag.id, name: tag.name }));
}

function handleTodoTagCreate(state: TodoTagState, action: TodoTagActionCreate) {
  const todoTag: TodoTag = {
    id: nanoid(),
    name: action.name,
    new: true,
    checked: true,
  };

  const newTags = [...state.tags, todoTag];

  return {
    tags: newTags,
    displayedTags: filterTodoTags(newTags, state.searchText),
    searchText: state.searchText,
  };
}

function handleTodoTagCheck(
  state: TodoTagState,
  action: TodoTagActionCheck | TodoTagActionUncheck
) {
  const index = state.tags.findIndex((todoTag) => todoTag.id === action.id);
  if (index === -1) {
    throw new Error("todoTag not found");
  }

  const checked = action.type === "todoTag/check";
  const newState = [...state.tags];
  const todoTag = newState[index];
  newState[index] = {
    ...todoTag,
    checked,
  };

  return {
    tags: newState,
    displayedTags: filterTodoTags(newState, state.searchText),
    searchText: state.searchText,
  };
}

function handleTodoTagSearch(state: TodoTagState, action: TodoTagActionSearch) {
  const searchText = action.searchText;
  const displayedTags = filterTodoTags(state.tags, searchText);

  return {
    tags: state.tags,
    displayedTags,
    searchText,
  };
}

function handleTodoTagReset(state: TodoTagState, _: TodoTagActionReset) {
  return {
    tags: state.tags,
    displayedTags: state.tags,
    searchText: "",
  };
}

function filterTodoTags(tags: TodoTag[], searchText: string): TodoTag[] {
  if (searchText.trim() === "") {
    return tags;
  }

  return tags.filter((tag) =>
    tag.name.trim().toLowerCase().includes(searchText.trim().toLowerCase())
  );
}
