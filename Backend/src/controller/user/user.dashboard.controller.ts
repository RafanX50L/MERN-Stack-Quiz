import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';
import { HttpResponse } from '@/constants/response-message.constant';
import { Request, Response, NextFunction } from 'express';
import { IUserDashboardService } from '@/core/interface/service/user/Iuser.dashboard.service';
import { IUserDashboardController } from '@/core/interface/controller/user/Iuser.dashboard.controller';

export class UserDashboardController implements IUserDashboardController {
  constructor(private readonly _service: IUserDashboardService) {}

  async getUserDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        return void res.status(400).json({ error: 'userId is required' });
      }

      const data = await this._service.getUserDashboard(userId);
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}