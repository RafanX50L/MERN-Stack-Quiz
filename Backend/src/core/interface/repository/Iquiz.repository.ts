import { IQuiz } from "@/models/quiz.model";
import { IBaseRepository } from "./IBase.repository";

export interface IQuizRepository extends IBaseRepository<IQuiz> {
    findFiltered(
        query: Record<string, any>,
        page: number,
        limit: number
    ): Promise<{ quizzes: IQuiz[]; total: number }>;
}
