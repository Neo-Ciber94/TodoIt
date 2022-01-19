import { TestConfig } from "yup";
import { AnyObject } from "yup/lib/types";

export function notBlankString(
  message: string
): TestConfig<string | undefined, AnyObject> {
  return {
    message,
    test: (value) => {
      return value != null && value.trim().length > 0;
    },
  };
}
