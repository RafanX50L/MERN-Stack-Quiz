import { IQuizRepository } from "@/core/interface/repository/Iquiz.repository";
import { IQuizResultRepository } from "@/core/interface/repository/IquizResult.respository";
import { IAdminDashboardService } from "@/core/interface/service/admin/Iadmin.dashboard.service";

export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    private readonly _quizRepo: IQuizRepository,
    private readonly _quizResultRepo: IQuizResultRepository,
  ) {}
  
  async getAdminDashboard() {
    const totalQuizzes = await this._quizRepo.countDocuments({});
    const totalAttempts = await this._quizResultRepo.countDocuments({});
    const totalUsers = await this._quizResultRepo.countDocuments({});
    const platformAvgScore = await this._quizResultRepo.getPlatformAvgScore();
    const attemptsOverTime = await this._quizResultRepo.getAttemptsOverTime();
    const categoryPerformance = await this._quizResultRepo.getCategoryPerformance();
    const difficultyBreakdown = await this._quizResultRepo.getDifficultyBreakdown();
    const topQuizzes = await this._quizResultRepo.getTopQuizzes();
    const userGrowth = await this._quizResultRepo.getUserGrowth();

    return {
        stats: {
        totalQuizzes,
        totalAttempts,
        totalUsers,
        avgScore: platformAvgScore[0]?.avg ? Math.round(platformAvgScore[0].avg) : 0
      },
      charts: {
        attemptsOverTime: attemptsOverTime.map(d => ({
          date: d._id,
          attempts: d.count
        })),
        categoryPerformance: categoryPerformance.map(c => ({
          category: c._id,
          attempts: c.attempts,
          avgScore: Math.round(c.avgScore)
        })),
        difficultyBreakdown: difficultyBreakdown.map(d => ({
          difficulty: d._id,
          count: d.count
        })),
        topQuizzes: topQuizzes.map(q => ({
          quiz: q.title,
          attempts: q.attempts,
          avgScore: q.avgScore
        })),
        userGrowth: userGrowth.map(g => ({
          date: g.date,
          users: g.uniqueUsers
        }))
      }
    }
  }
}