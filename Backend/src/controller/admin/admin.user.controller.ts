import { HttpResponse } from "@/constants/response-message.constant";
import { IAdminUserController } from "@/core/interface/controller/admin/Iadmin.user.controller";
import { IAdminUserService } from "@/core/interface/service/admin/Iadmin.user.service";
import { createHttpError } from "@/utils";
import { ControllerErrorHandler } from "@/utils/controller-error-handler.util";
import { Request, Response, NextFunction } from "express";

export class AdminUserController implements IAdminUserController {
  constructor(private readonly _service: IAdminUserService) {}

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this._service.getUsers(req.query);
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async toggleBlockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isBlocked } = req.body;

      if (typeof isBlocked !== "boolean") {
        createHttpError(400, "isBlocked must be boolean");
        return;
      }

      const data = await this._service.toggleBlockUser(id, isBlocked);
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.USER_STATUS_UPDATED_SUCCESSFULLY);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async bulkToggleBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids, isBlocked } = req.body;

      if (!Array.isArray(ids) || typeof isBlocked !== "boolean") {
        createHttpError(400, "Invalid request");
        return;
      }

      const data = await this._service.bulkToggleBlock(ids, isBlocked);
      ControllerErrorHandler.handleSuccess(res, data, HttpResponse.BULK_ACTION_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}
