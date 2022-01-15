import { ITodo } from "@shared/models/todo.model";
import { WithOptional } from "@shared/types";
import yup, { SchemaOf, TestConfig } from "yup";
import { AnyObject } from "yup/lib/types";

export type TodoEntity = Pick<ITodo, "title" | "content" | "color">;
export type TodoAdd = WithOptional<TodoEntity, "color">;
export type TodoUpdate = Partial<TodoEntity>;

export const todoAddValidator: SchemaOf<TodoAdd> = yup.object({
  title: yup.string().required("Title is required").test(notBlankString()),
  content: yup.string().required("Content is required").test(notBlankString()),
  color: yup.string().optional().test(notBlankString()),
});

export const todoUpdateValidator: SchemaOf<TodoUpdate> = yup.object({
  title: yup.string().optional().test(notBlankString()),
  content: yup.string().optional().test(notBlankString()),
  color: yup.string().optional().test(notBlankString()),
});

function notBlankString(): TestConfig<string | undefined, AnyObject> {
  return {
    message: "Must be a non-empty string",
    test: (value) => {
      return value != null && value.trim().length > 0;
    },
  };
}
