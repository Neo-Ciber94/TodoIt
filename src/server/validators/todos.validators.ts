import { PASTEL_COLORS } from "@shared/config";
import { ITodo } from "@shared/models/todo.model";
import { PartialProperty } from "@shared/types";
import { SchemaOf } from "yup";
import * as yup from "yup";
import { notBlankString } from ".";

// prettier-ignore
export type TodoEntity = Pick<ITodo, "title" | "content" | "color" | "completed">;
export type TodoCreate = Omit<PartialProperty<TodoEntity, "color">, "completed">;
export type TodoUpdate = Partial<TodoEntity>;

const TITLE_REQUIRED = "Title is required";
const CONTENT_REQUIRED = "Content is required";
const TITLE_NOT_EMPTY = "Title cannot be empty";
const CONTENT_NOT_EMPTY = "Content cannot be empty";

export const todoCreateValidator: SchemaOf<TodoCreate> = yup.object({
  title: yup
    .string()
    .required(TITLE_REQUIRED)
    .test(notBlankString(TITLE_NOT_EMPTY)),
  content: yup
    .string()
    .required(CONTENT_REQUIRED)
    .test(notBlankString(CONTENT_NOT_EMPTY)),
  color: yup.string().optional().oneOf(PASTEL_COLORS),
});

export const todoUpdateValidator: SchemaOf<TodoUpdate> = yup.object({
  title: yup.string().optional().test(notBlankString(TITLE_NOT_EMPTY)),
  content: yup.string().optional().test(notBlankString(CONTENT_NOT_EMPTY)),
  color: yup.string().optional().oneOf(PASTEL_COLORS),
  completed: yup.boolean().optional(),
});
