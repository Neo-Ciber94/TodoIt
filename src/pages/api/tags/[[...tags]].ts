import { ApiController } from "@server/controllers/api-controller";
import { commonMiddlewares } from "@server/middlewares/common";
import {
  ITagBulkOperationResult,
  TagRepository,
} from "@server/repositories/tag.repository";
import type{ ApiContext } from "@server/types";
import { tagBulkOperationValidator } from "@server/validators/tag.validator";
import { ITag, ITagBulkOperation } from "@shared/models/tag.model";
import { Post, UseMiddleware, withController } from "next-controllers";

@UseMiddleware(...commonMiddlewares)
class TagApiController extends ApiController<ITag> {
  constructor() {
    super(new TagRepository(), {
      query: true,
    });
  }

  @Post("/bulk")
  async bulkOperation({
    request,
  }: ApiContext): Promise<ITagBulkOperationResult> {
    const repo = this.repository as TagRepository;

    const input = request.body as ITagBulkOperation;
    await tagBulkOperationValidator.validate(input);
    
    const result = await repo.bulkOperation(input, this.session.userId || "");
    return result;
  }
}

export default withController(TagApiController);
