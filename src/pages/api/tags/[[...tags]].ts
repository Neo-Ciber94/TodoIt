import { ApiController } from "@server/controllers/api-controller";
import mongoDbMiddleware from "@server/middlewares/mongodb";
import { TagRepository } from "@server/repositories/tag.repository";
import { ITag } from "@shared/models/tag.model";
import morgan from "morgan";
import { UseMiddleware, withController } from "next-controllers";

@UseMiddleware(morgan("dev"), mongoDbMiddleware())
class TagApiController extends ApiController<ITag> {
  constructor() {
    super(new TagRepository(), {
      query: true,
    });
  }
}

export default withController(TagApiController);
