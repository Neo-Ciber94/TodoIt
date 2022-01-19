import { ITag } from "@shared/models/tag.model";
import { SchemaOf } from "yup";
import * as yup from "yup";
import { notBlankString } from ".";

const NAME_REQUIRED = "Name is required";
const NAME_NOT_EMPTY = "Name cannot be empty";

export type TagInput = Pick<ITag, "name">;

export const tagCreateValidator: SchemaOf<TagInput> = yup.object({
  name: yup
    .string()
    .required(NAME_REQUIRED)
    .test(notBlankString(NAME_NOT_EMPTY)),
});

export const tagUpdateValidator: SchemaOf<TagInput> = yup.object({
  name: yup
    .string()
    .required(NAME_REQUIRED)
    .test(notBlankString(NAME_NOT_EMPTY)),
});
