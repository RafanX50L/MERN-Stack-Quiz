import { IQuizRepository } from '@/core/interface/repository/Iquiz.repository';
import { IQuizResultRepository } from '@/core/interface/repository/IquizResult.respository';
import { Types } from 'mongoose';
import { toObjectId } from '@/utils';
import { IUserQuizService } from '@/core/interface/service/user/Iuser.quiz..service';

export class UserQuizService implements IUserQuizService {
  constructor(
    private readonly _quizRepo: IQuizRepository,
    private readonly _resultRepo: IQuizResultRepository
  ) {}

  // GET PUBLIC QUIZZES – uses QuizRepository only
  async getPublicQuizzes(
    filters: { category?: string; difficulty?: string; search?: string },
    page: number,
    limit: number
  ) {
    const query: any = {};
    if (filters.category) query.category = filters.category;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const [quizzes, total] = await Promise.all([
      this._quizRepo.findFiltered(query, page, limit),

      this._quizRepo.countDocuments(query)
    ]);

    return {
      quizzes: quizzes.quizzes.map(q => ({
        _id: q._id,
        title: q.title,
        description: q.description,
        category: q.category,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        questionCount: q.questions.length
      })),
      pagination: { page, limit, total }
    };
  }

  // GET QUIZ BY ID – uses QuizRepository only
  async getQuizById(id: string) {
    const quiz = await this._quizRepo.findById(new Types.ObjectId(id));
    if (!quiz) throw new Error('Quiz not found');

    return {
      _id: quiz._id,
      title: quiz.title,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    };
  }

  // SUBMIT QUIZ RESULT – uses **both** repositories
  async submitQuizResult(
    quizId: string,
    userId: string,
    answers: any[],
    timeTaken: number
  ) {
    // 1. Fetch quiz via QuizRepository
    const quiz = await this._quizRepo.findById(toObjectId(quizId));
    if (!quiz) throw new Error('Quiz not found');

    // 2. Calculate score
    let correct = 0;
    quiz.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const score = Math.round((correct / quiz.questions.length) * 100);

    // 3. Save result via QuizResultRepository (using model only for structure)
    const resultDoc = await this._resultRepo.create({
      quiz: toObjectId(quizId),
      userId,
      score,
      totalQuestions: quiz.questions.length,
      timeTaken,
      answers
    });

    // Use repository to save (BaseRepository has .create())
    const savedResult = await this._resultRepo.create(resultDoc);

    return {
      success: true,
      score,
      correct,
      total: quiz.questions.length,
      percentage: score,
      timeTaken,
      resultId: savedResult._id
    };
  }
}