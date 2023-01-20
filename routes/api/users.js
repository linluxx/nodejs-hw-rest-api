const express = require("express");
const {
  register,
  login,
  current,
  logout,
} = require("../../controllers/user.controller");
const { tryCatchWrapper, validateBody, auth } = require("../../middlewares");
const { loginSchema, registerSchema } = require("../../schemas/user");

const authRouter = express.Router();
authRouter.post(
  "/signup",
  validateBody(registerSchema),
  tryCatchWrapper(register)
);
authRouter.post("/login", validateBody(loginSchema), tryCatchWrapper(login));
authRouter.get("/current", auth, tryCatchWrapper(current));
authRouter.get("/logout", auth, tryCatchWrapper(logout));

module.exports = {
  authRouter,
};
