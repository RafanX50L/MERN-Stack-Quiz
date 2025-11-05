import { Request, Response, NextFunction } from "express";

export interface IAdminUserController {
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleBlockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  bulkToggleBlock(req: Request, res: Response, next: NextFunction): Promise<void>;
}
