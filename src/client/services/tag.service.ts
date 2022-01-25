import { ITagBulkOperationResult } from "@server/repositories/tag.repository";
import { ITag, ITagBulkOperation } from "@shared/models/tag.model";
import { RequestConfig } from "../http-client";
import { ApiService } from "./api-service";

export class TagApiService extends ApiService<ITag> {
  constructor() {
    super("/tags");
  }

  async bulkOperation(
    input: ITagBulkOperation,
    config: RequestConfig = {}
  ): Promise<ITagBulkOperationResult> {
    const result = await this.client.post<
      ITagBulkOperationResult,
      ITagBulkOperation
    >("/bulk", input, config);

    return result;
  }
}
