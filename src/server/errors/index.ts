import { ValidationError } from "yup";

export module ThrowHelper {
  export function expectedUserId(): never {
    throw new ValidationError("Expected userId");
  }
}
