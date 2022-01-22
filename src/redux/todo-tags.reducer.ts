import { ITag, ITagInput } from "@shared/models/tag.model";
import { ITodo } from "@shared/models/todo.model";
import { nanoid } from "nanoid";

export interface TodoTag {
  id: string;
  new: boolean;
  checked: boolean;
  name: string;
}

export interface TodoTagCreate {
  type: "todoTag/create";
  name: string;
}

export interface TodoTagCheck {
  type: "todoTag/check";
  id: string;
}

export interface TodoTagUncheck {
  type: "todoTag/uncheck";
  id: string;
}

export type TodoTagAction = TodoTagCreate | TodoTagCheck | TodoTagUncheck;

export function todoTagsReducer(
  state: TodoTag[],
  action: TodoTagAction
): TodoTag[] {
  switch (action.type) {
    case "todoTag/create": {
      const todoTag: TodoTag = {
        id: nanoid(),
        new: true,
        name: action.name,
        checked: true,
      };
      return [...state, todoTag];
    }
    case "todoTag/check":
      return markTodoAsChecked(state, action.id, true);
    case "todoTag/uncheck": {
      return markTodoAsChecked(state, action.id, false);
    }
    default:
      return state;
  }
}

export function createTodoTagsInitialState(
  todo: ITodo | undefined,
  tags: ITag[]
): TodoTag[] {
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

  return result;
}

export function selectTodoTags(tags: TodoTag[]): ITagInput[] {
  return tags
    .filter((tag) => tag.checked)
    .map((tag) => ({ id: tag.id, name: tag.name }));
}

function markTodoAsChecked(
  state: TodoTag[],
  id: string,
  checked: boolean
): TodoTag[] {
  const index = state.findIndex((todoTag) => todoTag.id === id);
  if (index === -1) {
    throw new Error("todoTag not found");
  }

  const newState = [...state];
  const todoTag = newState[index];
  newState[index] = {
    ...todoTag,
    checked,
  };
  return newState;
}
