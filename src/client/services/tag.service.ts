import { ITag } from "@shared/models/tag.model";
import { ApiService } from "./api-service";

export class TagApiService extends ApiService<ITag> {
  constructor() {
    super("/tags");
  }
}
