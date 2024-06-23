const express = require("express");
const userRouter = express.Router();
const { signupuser, login, logout } = require("../controller/controller");
const authMiddleware = require("../middleswares/auth");

userRouter.route("/signup").post(authMiddleware, signupuser);
userRouter.route("/login").post(authMiddleware, login);
userRouter.route("/logout").post(authMiddleware, logout);

module.exports = userRouter;
