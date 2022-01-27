import { ITag, ITagBulkOperation } from "@shared/models/tag.model";
import { SchemaOf } from "yup";
import * as yup from "yup";
import { notBlankString } from ".";

const NAME_REQUIRED = "Tag name is required";
const NAME_NOT_EMPTY = "Tag name cannot be empty";

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

export const tagBulkOperationValidator: SchemaOf<ITagBulkOperation> =
  yup.object({
    insert: yup.array().of(
      yup.object({
        id: yup.string().optional(),
        name: yup
          .string()
          .required(NAME_REQUIRED)
          .test(notBlankString(NAME_NOT_EMPTY)),
      })
    ),
    delete: yup.array().of(yup.string().required()),
  });
