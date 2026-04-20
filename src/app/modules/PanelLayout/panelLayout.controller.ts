import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { PanelLayoutService } from "./panelLayout.service"

const getMyLayout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id as string
  const result = await PanelLayoutService.getLayoutByUserId(userId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Panel layout retrieved successfully",
    data: result,
  })
})

const upsertMyLayout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id as string
  const result = await PanelLayoutService.upsertLayout(userId, req.body.layout)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Panel layout saved successfully",
    data: result,
  })
})

export const PanelLayoutController = {
  getMyLayout,
  upsertMyLayout,
}
