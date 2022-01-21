import { connectMongoDb } from "@server/database/connectMongoDb";
import morgan from "morgan";
import { Get, UseMiddleware, withController } from "next-controllers";

interface HealthCheckResult {
  database: "ok" | "error";
  server: "ok" | "error";
}

@UseMiddleware(morgan("dev"))
class HealthCheckController {
  @Get("/")
  async healthCheck(): Promise<HealthCheckResult> {
    const databaseCheck = await this.checkDatabase();

    return {
      server: "ok",
      database: databaseCheck ? "ok" : "error",
    };
  }

  async checkDatabase(): Promise<boolean> {
    try {
      const connection = await connectMongoDb();
      return connection != null;
    } catch {
      return false;
    }
  }
}

export default withController(HealthCheckController);
