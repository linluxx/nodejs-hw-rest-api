const express = require("express");
const {
  register,
  login,
  current,
  logout,
  subscriptionStatusUpdate,
  updateAvatar,
  verification,
  reverification,
} = require("../../controllers/user.controller");
const {
  tryCatchWrapper,
  validateBody,
  auth,
  upload,
  resizeAvatar,
} = require("../../middlewares");
const {
  loginSchema,
  registerSchema,
  updateSubscriptionSchema,
} = require("../../schemas/user");

const authRouter = express.Router();
authRouter.post(
  "/signup",
  validateBody(registerSchema),
  tryCatchWrapper(register)
);
authRouter.post("/login", validateBody(loginSchema), tryCatchWrapper(login));
authRouter.get("/current", auth, tryCatchWrapper(current));
authRouter.get("/logout", auth, tryCatchWrapper(logout));
authRouter.patch(
  "/",
  auth,
  validateBody(updateSubscriptionSchema),
  tryCatchWrapper(subscriptionStatusUpdate)
);
authRouter.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  tryCatchWrapper(resizeAvatar),
  tryCatchWrapper(updateAvatar)
);

authRouter.get(
  "/verify/:verificationToken",
  tryCatchWrapper(verification)
);

authRouter.post("/verify", tryCatchWrapper(reverification));

module.exports = {
  authRouter,
};
