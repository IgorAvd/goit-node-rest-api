import express from "express";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  updateSubscriptionSchema,
} from "../models/user.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import {
  getCurrent,
  login,
  logout,
  register,
  resendVerifyEmail,
  updateAvatar,
  updateSubscription,
  verifyEmail,
} from "../controllers/authControllers.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  ctrlWrapper(register)
);

authRouter.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));

authRouter.post(
  "/verify",
  validateBody(emailSchema),
  ctrlWrapper(resendVerifyEmail)
);

authRouter.post("/login", validateBody(loginSchema), ctrlWrapper(login));

authRouter.get("/current", authenticate, ctrlWrapper(getCurrent));

authRouter.post("/logout", authenticate, ctrlWrapper(logout));

authRouter.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  ctrlWrapper(updateSubscription)
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrlWrapper(updateAvatar)
);

export default authRouter;
