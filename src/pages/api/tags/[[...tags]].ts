import { ApiController } from "@server/controllers/api-controller";
import { commonMiddlewares } from "@server/middlewares/common";
import { TagRepository } from "@server/repositories/tag.repository";
import { ITag } from "@shared/models/tag.model";
import { UseMiddleware, withController } from "next-controllers";

@UseMiddleware(...commonMiddlewares)
class TagApiController extends ApiController<ITag> {
  constructor() {
    super(new TagRepository(), {
      query: true,
    });
  }
}

export default withController(TagApiController);
