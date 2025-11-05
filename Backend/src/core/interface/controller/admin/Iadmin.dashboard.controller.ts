import { NextFunction, Request, Response } from "express";

export interface IAdminDashboardController {
    getAdminDashboard(req: Request, res: Response, next: NextFunction): Promise<void>
}