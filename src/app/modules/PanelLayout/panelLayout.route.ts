import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { PanelLayoutController } from "./panelLayout.controller"
import { PanelLayoutValidation } from "./panelLayout.validation"

const router = express.Router()

router.get("/me", auth(), PanelLayoutController.getMyLayout)
router.put(
  "/me",
  auth(),
  validateRequest(PanelLayoutValidation.upsertLayoutValidationSchema),
  PanelLayoutController.upsertMyLayout
)

export const PanelLayoutRoutes = router
