import express from "express"
import validateRequest from "../../middlewares/validateRequest"
import { AuthController } from "./auth.controller"
import auth from "../../middlewares/auth"
import { AuthValidation } from "./auth.validation"

const router = express.Router()

// user login route
router.post(
	"/login",
	validateRequest(AuthValidation.loginValidationSchema),
	AuthController.loginUser
)

// user logout route
router.post("/logout", AuthController.logoutUser)

router.get("/profile", auth(), AuthController.getMyProfile)

router.put("/change-password", auth(), AuthController.changePassword)

router.post(
	"/forgot-password",
	validateRequest(AuthValidation.forgotPasswordValidationSchema),
	AuthController.forgotPassword
)

router.post(
	"/reset-password",
	validateRequest(AuthValidation.resetPasswordValidationSchema),
	AuthController.resetPassword
)

router.post(
	"/verify-forgot-password",
	validateRequest(AuthValidation.verifyForgotPasswordValidationSchema),
	AuthController.verifyForgetPassword
)

router.post(
	"/send-otp",
	validateRequest(AuthValidation.sendOtpValidationSchema),
	AuthController.sendOtp
)

export const AuthRoutes = router
