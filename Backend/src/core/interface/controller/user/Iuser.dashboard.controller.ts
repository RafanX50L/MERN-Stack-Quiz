import { Request, Response, NextFunction } from 'express';

export interface IUserDashboardController {
  getUserDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
}