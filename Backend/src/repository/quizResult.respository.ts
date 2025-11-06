import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import QuizResultModel, { IQuizResult } from "@/models/quizResult.model";
import { IQuizResultRepository } from "@/core/interface/repository/IquizResult.respository";

export class QuizResultRepository
  extends BaseRepository<IQuizResult>
  implements IQuizResultRepository
{
  constructor() {
    super(QuizResultModel);
  }

  async getTotalAttempts(): Promise<number> {
    return this.model.countDocuments();
  }

  async getTotalUniqueUsers(): Promise<number> {
    const uniqueUsers = await this.model.distinct("userId");
    return uniqueUsers.length;
  }

  async getPlatformAvgScore(): Promise<number> {
    const result = await this.model.aggregate([
      { $group: { _id: null, avg: { $avg: "$score" } } }
    ]);
    return result[0]?.avg || 0;
  }

  async getAttemptsOverTime(): Promise<any[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.model.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getCategoryPerformance(): Promise<any[]> {
    return this.model.aggregate([
      {
        $lookup: {
          from: "quizzes",
          localField: "quiz",
          foreignField: "_id",
          as: "quizDoc"
        }
      },
      { $unwind: "$quizDoc" },
      {
        $group: {
          _id: "$quizDoc.category",
          attempts: { $sum: 1 },
          avgScore: { $avg: "$score" }
        }
      }
    ]);
  }

  async getDifficultyBreakdown(): Promise<any[]> {
    return this.model.aggregate([
      {
        $lookup: {
          from: "quizzes",
          localField: "quiz",
          foreignField: "_id",
          as: "quizDoc"
        }
      },
      { $unwind: "$quizDoc" },
      {
        $group: {
          _id: "$quizDoc.difficulty",
          count: { $sum: 1 }
        }
      }
    ]);
  }

  async getTopQuizzes(): Promise<any[]> {
    return this.model.aggregate([
      {
        $group: {
          _id: "$quiz",
          attempts: { $sum: 1 },
          avgScore: { $avg: "$score" }
        }
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "_id",
          as: "quiz"
        }
      },
      { $unwind: "$quiz" },
      { $sort: { attempts: -1 } },
      { $limit: 5 },
      {
        $project: {
          title: "$quiz.title",
          attempts: 1,
          avgScore: { $round: ["$avgScore", 1] }
        }
      }
    ]);
  }

  async getUserGrowth(): Promise<any[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.model.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          users: { $addToSet: "$userId" }
        }
      },
      {
        $project: {
          date: "$_id",
          uniqueUsers: { $size: "$users" }
        }
      },
      { $sort: { date: 1 } }
    ]);
  }

  /**
   * Fetch all quiz results for a specific user, with quiz details populated.
   */
  async getUserResults(userId: string): Promise<IQuizResult[]> {
    return this.model
      .find({ userId })
      .populate("quiz", "title category difficulty")
      .sort({ submittedAt: -1 });
  }

  /**
   * Fetch attempts over time for a user (last 30 days)
   */
  async getUserAttemptsOverTime(userId: string): Promise<any[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.model.aggregate([
      { $match: { userId, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  /**
   * Fetch category performance for a user
   */
  async getUserCategoryPerformance(userId: string): Promise<any[]> {
    return this.model.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "quizzes",
          localField: "quiz",
          foreignField: "_id",
          as: "quizDoc"
        }
      },
      { $unwind: "$quizDoc" },
      {
        $group: {
          _id: "$quizDoc.category",
          attempts: { $sum: 1 },
          avgScore: { $avg: "$score" }
        }
      }
    ]);
  }
}
