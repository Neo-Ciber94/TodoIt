import regexparam from "regexparam";

type RegexParamResult = {
  keys: Array<string> | boolean;
  pattern: RegExp;
};

export class RoutePath {
  private matches: RegexParamResult;

  constructor(pattern: RegExp);
  constructor(pattern: string);
  constructor(pattern: string | RegExp) {
    if (typeof pattern === "string") {
      this.matches = regexparam(pattern);
    } else {
      this.matches = regexparam(pattern);
    }
  }

  public match(url: string): Record<string, string> | null {
    const result = this.matches.pattern.exec(url);

    if (result == null) {
      return null;
    }

    if (typeof this.matches.keys === "boolean") {
      return result.groups || {};
    } else {
      const keys = this.matches.keys;
      const params: Record<string, string> = {};

      for (let i = 0; i < keys.length; i++) {
        params[keys[i]] = result[i + 1];
      }

      return params;
    }
  }
}
