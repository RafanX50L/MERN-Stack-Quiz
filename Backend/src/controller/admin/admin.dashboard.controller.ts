import { HttpResponse } from "@/constants/response-message.constant";
import { IAdminDashboardController } from "@/core/interface/controller/admin/Iadmin.dashboard.controller";
import { IAdminDashboardService } from "@/core/interface/service/admin/Iadmin.dashboard.service";
import { ControllerErrorHandler } from "@/utils/controller-error-handler.util";
import { NextFunction, Request, Response } from "express";

export class AdminDashboardController implements IAdminDashboardController {
  constructor(private readonly _service: IAdminDashboardService) {}
   async getAdminDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await this._service.getAdminDashboard();
            ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }
}