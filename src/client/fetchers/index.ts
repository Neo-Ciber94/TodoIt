import { RequestConfig } from "../http-client";
import { clientInstance } from "../services";

// prettier-ignore
export function fetcher<T = any>(url: string, config: RequestConfig = {}): Promise<T> {
  return clientInstance.get(url, config);
}
