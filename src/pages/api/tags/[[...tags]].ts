import { ApiController } from "@server/controllers/api-controller";
import { TagRepository } from "@server/repositories/tag.repository";
import { ITag } from "@shared/models/tag.model";
import { withController } from "next-controllers";

class TagApiController extends ApiController<ITag> {
  constructor() {
    super(new TagRepository(), {
      query: true,
    });
  }
}

export default withController(TagApiController);
