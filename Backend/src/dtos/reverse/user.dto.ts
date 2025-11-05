import IUser from "@/core/interface/model/IUser.model";

export class UserDTO {
  static async toResponse(user: IUser): Promise<Partial<IUser> & { status: string | null }> {
    const userData: Partial<IUser> & { status: string | null } = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: null,
    };
    return userData;
  }
}