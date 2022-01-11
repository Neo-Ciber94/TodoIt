import { ValidationError } from "@server/utils/errors";
import { IUser } from "@shared/models/user.model";
import User from "@server/db/schemas/user.schema";
import { Model } from "mongoose";

export class UserRepository {
  protected readonly model: Model<IUser> = User;

  async createIfDontExist(userId: string): Promise<IUser> {
    if (userId == null) {
      throw new ValidationError("User id is required");
    }

    let user = await this.model.findOne({ userId });

    if (user == null) {
        user = await this.model.create({ userId });
    }

    return user;
  }

  async findById(userId: string): Promise<IUser | null> {
    if (userId == null) {
      throw new ValidationError("User id is required");
    }

    const user = await this.model.findOne({ userId });
    return user;
  }
}
