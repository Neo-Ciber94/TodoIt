import Tag from "@server/database/schemas/tag.schema";
import { TagModel } from "@server/database/schemas/tag.types";
import { ITag } from "@shared/models/tag.model";
import { Repository } from "./base/repository.base";

export class TagRepository extends Repository<ITag, TagModel> {
  constructor() {
    super(Tag);
  }

  public async findOrCreate(
    tags: Partial<ITag>[],
    userId: string
  ): Promise<ITag[]> {
    const ids = tags.map((tag) => tag.id);
    // const names = tags.map((tag) => tag.name);

    const existingTags = await this.find({
      // Using `as any` to allow use undefined `id`
      id: { $in: ids } as any ,  // FIXME: check for duplicated names 
      creatorUserId: userId,
    });

    const tagsToCreate = tags.filter(
      (tag) =>
        tag.id == null ||
        !existingTags.some((existingTag) => existingTag.id === tag.id)
    );

    const createdTags = await this.createMany(tagsToCreate);
    return [...existingTags, ...createdTags];
  }
}
