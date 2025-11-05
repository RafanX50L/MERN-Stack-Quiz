import { IQuizRepository } from "@/core/interface/repository/Iquiz.repository";
import { IAdminQuizService } from "@/core/interface/service/admin/Iadmin.quiz.service";
import { Request } from "express";

export class AdminQuizService implements IAdminQuizService {
  constructor(
    private readonly _quizRepo: IQuizRepository,
  ) {}

  async getQuizzes(req: Request) {
    const { search, category, difficulty, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const quizzes = (await this._quizRepo.findAll(query));
    const total = await this._quizRepo.countDocuments(query);

    return {
      quizzes,
      pagination: { page: +page, limit: +limit, total }
    };
  }

  async createQuiz(req: Request) {
    const { title, description, category, difficulty, timeLimit, questions } = req.body;
    if (!title || !category || !difficulty || !timeLimit || !questions?.length) {
      throw new Error("Missing required fields");
    }
    return await this._quizRepo.create({
      title,
      description,
      category,
      difficulty,
      timeLimit,
      questions
    });
  }

  async updateQuiz(req: Request) {
    const { id } = req.params;
    return await this._quizRepo.update(id, req.body);
  }

  async deleteQuiz(req: Request) {
    const { id } = req.params;
    await this._quizRepo.deleteOne({ _id: id });
  }

  async bulkDeleteQuizzes(req: Request) {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Invalid IDs");
    }
    const result = await this._quizRepo.deleteMany({ _id: { $in: ids } });
    return { deletedCount: ids.length };
  }

};