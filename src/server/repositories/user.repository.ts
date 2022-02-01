import User from "@server/database/schemas/user.schema";
import { IUser } from "@shared/models/user.model";

export class UserRepository {
  private readonly model = User;

  async getOrCreate(userId: string): Promise<IUser> {
    const user = await this.model.findOne({ userId });

    if (user == null) {
      const newUser = await this.model.create({ userId });
      return newUser;
    }

    return user;
  }

  exists(userId: string): Promise<boolean> {
    return this.model.exists({ userId });
  }
}
