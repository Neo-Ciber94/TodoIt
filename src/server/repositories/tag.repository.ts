import Tag, { TagModel } from "@server/database/schemas/tag.schema";
import logger from "@server/logging";
import { ITag, ITagBulkOperation } from "@shared/models/tag.model";
import { ClientSession } from "mongoose";
import { Repository } from "./base/repository";
import { runTransaction } from "./utils";

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
    userId: string,
    session?: ClientSession
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

    const createdTags = await this.createMany(tagsToCreate, session);
    return [...existingTags, ...createdTags];
  }

  public async bulkOperation(
    operation: ITagBulkOperation,
    userId: string,
    session?: ClientSession | null
  ): Promise<ITagBulkOperationResult> {
    const { insert, delete: ids } = operation;

    session ||= await this.model.startSession();

    const result = await runTransaction<ITagBulkOperationResult, TagModel>(
      this.model,
      session,
      async (session, model) => {
        const toCreate: Partial<ITag>[] = insert.filter((t) => t.id == null);
        const toUpdate: Partial<ITag>[] = insert.filter((t) => t.id != null);

        toCreate.forEach((tag) => {
          tag.creatorUserId = userId;
        });

        // Create tags
        const created = await model.create(toCreate, { session });

        // Update tags
        const updated: ITag[] = [];

        for (const tag of toUpdate) {
          const updateResult = await model.findByIdAndUpdate(
            tag.id,
            { ...tag },
            { session }
          );

          if (updateResult) {
            updated.push(updateResult);
          }
        }

        // Delete tags
        const deleted: number =
          ids.length === 0
            ? 0
            : await this.model
                .deleteMany({ _id: { $in: ids }, creatorUserId: userId })
                .then((t) => t.deletedCount);

        return { created, updated, deleted };
      }
    );

    if (result == null) {
      return {
        created: [],
        updated: [],
        deleted: 0,
      };
    }

    return result;
  }

  public async _bulkOperation(
    operation: ITagBulkOperation,
    userId: string,
    session?: ClientSession | null
  ): Promise<ITagBulkOperationResult> {
    const { insert, delete: ids } = operation;

    session ||= await this.model.startSession();

    try {
      const toCreate: Partial<ITag>[] = insert.filter((t) => t.id == null);
      const toUpdate: Partial<ITag>[] = insert.filter((t) => t.id != null);

      toCreate.forEach((tag) => {
        tag.creatorUserId = userId;
      });

      // Create tags
      const created = await this.model.create(toCreate, { session });

      // Update tags
      const updated: ITag[] = [];

      for (const tag of toUpdate) {
        const updateResult = await this.model.findByIdAndUpdate(
          tag.id,
          { ...tag },
          { session }
        );

        if (updateResult) {
          updated.push(updateResult);
        }
      }

      // Delete tags
      const deleted: number =
        ids.length === 0
          ? 0
          : await this.model
              .deleteMany({ _id: { $in: ids }, creatorUserId: userId })
              .then((t) => t.deletedCount);

      await session.commitTransaction();

      return { created, updated, deleted };
    } catch (err) {
      logger.error(err);
      await session.abortTransaction();
      return {
        created: [],
        updated: [],
        deleted: 0,
      };
    } finally {
      await session.endSession();
    }
  }
}
