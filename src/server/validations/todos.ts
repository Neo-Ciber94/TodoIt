import { PASTEL_COLORS } from "@shared/config";
import { ITodo } from "@shared/models/todo.model";
import { WithOptional } from "@shared/types";
import yup, { SchemaOf, TestConfig } from "yup";
import { AnyObject } from "yup/lib/types";

export type TodoEntity = Pick<ITodo, "title" | "content" | "color">;
export type TodoAdd = WithOptional<TodoEntity, "color">;
export type TodoUpdate = Partial<TodoEntity>;

const TITLE_REQUIRED = "Title is required";
const CONTENT_REQUIRED = "Content is required";
const TITLE_NOT_EMPTY = "Title cannot be empty";
const CONTENT_NOT_EMPTY = "Content cannot be empty";

export const todoAddValidator: SchemaOf<TodoAdd> = yup.object({
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
});

function notBlankString(
  message: string
): TestConfig<string | undefined, AnyObject> {
  return {
    message,
    test: (value) => {
      return value != null && value.trim().length > 0;
    },
  };
}
