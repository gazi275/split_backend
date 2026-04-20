import express from "express"
import validateRequest from "../../middlewares/validateRequest"
import { userController } from "./user.controller"
import auth from "../../middlewares/auth"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const registerValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const router = express.Router()

// *!register user
router.post(
  "/register",
  validateRequest(registerValidationSchema),
  userController.createUser
)

router.post("/verify-otp", userController.verifyOtpAndRegister)
// *!get all  user
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getUsers
)

// *!profile user
router.put("/profile", auth(), userController.updateProfile)

// *!update  user
router.put(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.updateUser
)

export const userRoutes = router
