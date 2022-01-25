import Tag from "@server/database/schemas/tag.schema";
import { TagModel } from "@server/database/schemas/tag.types";
import { ITag, ITagBulkOperation } from "@shared/models/tag.model";
import { Repository } from "./base/repository.base";

export type ITagBulkOperationResult = {
  created: ITag[];
  updated: ITag[];
  deleted: number;
};

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
      id: { $in: ids } as any, // FIXME: check for duplicated names
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

  public async bulkOperation(
    operation: ITagBulkOperation,
    userId: string
  ): Promise<ITagBulkOperationResult> {
    const { insert, delete: ids } = operation;

    const session = await this.model.startSession();
    const result = await session.withTransaction(async () => {
      const toCreate: Partial<ITag>[] = insert.filter((t) => t.id == null);
      const toUpdate: Partial<ITag>[] = insert.filter((t) => t.id != null);

      toCreate.forEach((tag) => {
        tag.creatorUserId = userId;
      });

      // toUpdate.forEach((tag) => {
      //   tag.updaterUserId = userId;
      // });

      // Create tags
      const created = await this.model.create(toCreate, { session });

      // Update tags
      const updated: ITag[] = [];

      for (const tag of toUpdate) {
        const existingTag = await this.model.findOne({
          id: tag.id,
          creatorUserId: userId,
        });

        if (existingTag) {
          const updateResult = await existingTag.update(tag, { session });
          updated.push(updateResult);
        }
      }

      // Delete tags
      const deleted = await this.model
        .deleteMany({
          id: { $in: ids },
          creatorUserId: userId,
        })
        .then((t) => t.deletedCount);

      return { created, updated, deleted };
    });

    await session.endSession();

    return result;
  }
}
