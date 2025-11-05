import { IAdminUserService } from "@/core/interface/service/admin/Iadmin.user.service";
import { IUserRepository } from "@/core/interface/repository/IUser.repository";
import { IQuizResultRepository } from "@/core/interface/repository/IquizResult.respository";
import { Request } from "express";
export class AdminUserService implements IAdminUserService {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _quizResultRepo: IQuizResultRepository
  ) {}

  async getUsers(queryParams: any) {
    const { search, role, status, page = 1, limit = 10 } = queryParams;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) query.role = role;
    if (status === "blocked") query.isBlocked = true;
    if (status === "active") query.isBlocked = false;

    const users = await this._userRepo.findAll(query);
    const total = await this._userRepo.countDocuments(query);

    const paged = users
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * limit, page * limit);

    const enriched = await Promise.all(
      paged.map(async (user) => {
        const results = await this._quizResultRepo.findAll({ userId: user._id });
        const taken = results.length;
        const avg =
          taken > 0
            ? Math.round(results.reduce((s, r) => s + r.score, 0) / taken)
            : 0;

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isBlocked: user.isBlocked,
          quizzesTaken: taken,
          avgScore: avg,
          joined: user.createdAt.toISOString().split("T")[0],
        };
      })
    );

    return { users: enriched, pagination: { page, limit, total } };
  }

  async toggleBlockUser(id: string, isBlocked: boolean) {
    const updated = await this._userRepo.blockOrUnblockUser(id);
    if (!updated) throw new Error("User not found");
    return {
      message: isBlocked ? "User blocked" : "User unblocked",
      user: updated,
    };
  }

  async bulkToggleBlock(ids: string[], isBlocked: boolean) {
    const modified = await this._userRepo.bulkToggleBlock(ids, isBlocked);
    return {
      message: `${modified} users ${isBlocked ? "blocked" : "unblocked"}`,
    };
  }
}