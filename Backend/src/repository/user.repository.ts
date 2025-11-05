import { IUserRepository } from "@/core/interface/repository/IUser.repository";
import { BaseRepository } from "@/repository/base.repository";
import { UserModel } from "@/models/user.model";
import IUser from "@/core/interface/model/IUser.model";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response-message.constant";
import { Types } from "mongoose";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    const createdUser = await this.model.create(user);
    return createdUser;
  }

  async blockOrUnblockUser(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.findById(new Types.ObjectId(id));
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, "User not found");
    }

    const updated = await this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          isBlocked: !user.isBlocked, // Flip the actual value
        },
      },
      { new: true }
    );

    if (!updated) {
      throw createHttpError(
        HttpStatus.NO_CONTENT,
        HttpResponse.FAILED_TO_UPDATE_USER_STATUS
      );
    }


    return { success: true, message: "User status updated scuccessfully" };
  }

  async bulkToggleBlock(ids: string[], isBlocked: boolean): Promise<number> {
    const result = await this.model.updateMany(
      { _id: { $in: ids } },
      { $set: { isBlocked } }
    );
    return result.modifiedCount;
  }

  async isBlocked(id: string): Promise<boolean> {
    const user = await this.model.findById(id);
    if (user && user.isBlocked) {
      return true;
    } else {
      return false;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<IUser | null> {
    return await this.model
      .findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })
      .populate("personalization");
  }
}
