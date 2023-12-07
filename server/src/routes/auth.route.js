import express from "express";
import {
  getUser,
  login,
  logout,
  signup,
} from "../controller/auth.controller.js";
import jwtAuth from "../middleware/jwtAuth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/user", jwtAuth, getUser);
authRouter.get("/logout", jwtAuth, logout);

export default authRouter;
