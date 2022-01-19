import Tag from "@server/database/schemas/tag.schema";
import { TagModel } from "@server/database/schemas/tag.types";
import { ITag } from "@shared/models/tag.model";
import { Repository } from "./base/repository.base";

export class TagRepository extends Repository<ITag, TagModel> {
  constructor() {
    super(Tag);
  }
}
