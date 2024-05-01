import express from "express";
import asyncHandler from "express-async-handler";
import AuthController from "./auth.controller";
import storeFile from "../common/middleware/storeFile";
import validator from "../common/config/joi-validation";
import registerDto from "./dtos/register.dto";
import loginDto from "./dtos/login.dto";
import authenticateUser from "../common/middleware/authenticate-user";
// const upload = multer();

const router = express.Router();
const registerFields = [
  { name: "profileImage", destination: "mediaData/profile", maxCounts: 1 }
];
router.post(
  "/register",
  asyncHandler(storeFile(registerFields)),
  validator.body(registerDto),
  asyncHandler(AuthController.register)
);

router.post(
  "/login",
  validator.body(loginDto),
  asyncHandler(AuthController.login)
);

router.post(
  "/logout",
  authenticateUser,
  asyncHandler(AuthController.logOut)
);


export default router;
