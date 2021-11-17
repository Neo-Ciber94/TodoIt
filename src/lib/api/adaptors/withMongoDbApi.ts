import withMongoDb from "../../db/mongodb/withMongoDb";
import { RestApiConfig, withRestApi } from "../withRestApi";

export default function withMongoDbApi(config: RestApiConfig) {
  return withMongoDb(withRestApi(config));
}
