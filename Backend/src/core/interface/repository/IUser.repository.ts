import IUser from "@/core/interface/model/IUser.model"; 
import { IBaseRepository } from "./IBase.repository";



export interface IUserRepository extends IBaseRepository<IUser> {
  createUser(user: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  isBlocked(id: string): Promise<boolean>;
  blockOrUnblockUser(
    id: string
  ): Promise<{ success: boolean; message: string }>;
  bulkToggleBlock(ids: string[], isBlocked: boolean): Promise<number>
  updatePassword(email: string, hashedPassword: string): Promise<IUser | null>;
}
