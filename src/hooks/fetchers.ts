import { ITag } from "@shared/models/tag.model";
import { services } from "src/client/services";
import useSWR from "swr";

export function useTags() {
  return useSWR<ITag[]>("/api/tags", () => services.tags.getAll());
}
