import { IQuizResultRepository } from '@/core/interface/repository/IquizResult.respository';
import { IUserDashboardService } from '@/core/interface/service/user/Iuser.dashboard.service';
import { IQuiz } from '@/models/quiz.model';

export class UserDashboardService implements IUserDashboardService {
  constructor(private readonly _resultRepo: IQuizResultRepository) {}

  async getUserDashboard(userId: string) {
    const results = await this._resultRepo.getUserResults(userId);

    if (results.length === 0) {
      return {
        stats: { totalQuizzes: 0, avgScore: 0, bestScore: 0 },
        recentResults: [],
        charts: { attemptsOverTime: [], scoreDistribution: [], categoryPerformance: [] }
      };
    }

    // ---- Stats ----
    const totalQuizzes = results.length;
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const avgScore = Math.round(totalScore / totalQuizzes);
    const bestScore = Math.max(...results.map(r => r.score));

    // ---- Recent Results ----
    const recentResults = results.slice(0, 5).map(r => ({
      quizId: r.quiz._id,
      title: (r.quiz as IQuiz).title,
      category: (r.quiz as IQuiz).category,
      score: r.score,
      date: r.createdAt.toISOString().split("T")[0],
    }));

    // ---- Charts ----
    const attemptsOverTime = (await this._resultRepo.getUserAttemptsOverTime(userId)).map(d => ({
      date: d._id,
      attempts: d.count,
    }));

    const categoryData = await this._resultRepo.getUserCategoryPerformance(userId);
    const categoryPerformance = categoryData.map(c => ({
      category: c._id,
      attempts: c.attempts,
      avgScore: Math.round(c.avgScore),
    }));

    // ---- Score Distribution ----
    const scoreBuckets = [
      { range: "0-49%", min: 0, max: 49, count: 0 },
      { range: "50-59%", min: 50, max: 59, count: 0 },
      { range: "60-69%", min: 60, max: 69, count: 0 },
      { range: "70-79%", min: 70, max: 79, count: 0 },
      { range: "80-89%", min: 80, max: 89, count: 0 },
      { range: "90-100%", min: 90, max: 100, count: 0 },
    ];

    results.forEach(r => {
      for (const bucket of scoreBuckets) {
        if (r.score >= bucket.min && r.score <= bucket.max) {
          bucket.count++;
          break;
        }
      }
    });

    const scoreDistribution = scoreBuckets.filter(b => b.count > 0);

    return {
      stats: { totalQuizzes, avgScore, bestScore },
      recentResults,
      charts: { attemptsOverTime, scoreDistribution, categoryPerformance },
    };
  }
}
