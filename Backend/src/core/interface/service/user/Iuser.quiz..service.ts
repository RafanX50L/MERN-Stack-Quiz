export interface IUserQuizService {
  getPublicQuizzes(
    filters: { category?: string; difficulty?: string; search?: string },
    page: number,
    limit: number
  ): Promise<{ quizzes: any[]; pagination: { page: number; limit: number; total: number } }>;

  getQuizById(id: string): Promise<any>;

  submitQuizResult(
    quizId: string,
    userId: string,
    answers: any[],
    timeTaken: number
  ): Promise<any>;
}