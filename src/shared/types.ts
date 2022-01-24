/**
 * Makes a single property of `T` optional (partial).
 */
export type PartialProperty<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Makes all properties and properties of nested objects of `T` optional (partial).
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};


/**
 * Converts the properties of a object to boolean.
 */
export type AsBoolean<T> = {
  [P in keyof T]: T[P] extends boolean ? T[P] : boolean;
}