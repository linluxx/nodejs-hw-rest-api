const express = require("express");
const {
  register,
  login,
  current,
  logout,
  subscriptionStatusUpdate,
  updateAvatar,
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

module.exports = {
  authRouter,
};
