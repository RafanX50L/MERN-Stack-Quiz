import { BaseRepository } from './base.repository';
import { IQuizRepository } from '@/core/interface/repository/Iquiz.repository';
import quizModel, { IQuiz } from '@/models/quiz.model';

export class QuizRepository extends BaseRepository<IQuiz> implements IQuizRepository {

  constructor() {
    super(quizModel);
  }

  /**
   * Fetch quizzes with pagination and optional filters
   */
  async findFiltered(
    query: Record<string, any>,
    page: number,
    limit: number
  ): Promise<{ quizzes: IQuiz[]; total: number }> {
    const [quizzes, total] = await Promise.all([
      this.model
        .find(query)
        .select('title description category difficulty timeLimit questions')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.model.countDocuments(query)
    ]);

    return { quizzes, total };
  }
  
};