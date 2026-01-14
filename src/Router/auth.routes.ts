import express from "express";
import { SignUp, login } from "../Controller/auth.controller";
import { validateRequest } from "../Middleware/validation.middleware";
import { SignUpSchema, LoginSchema } from "../Schema/auth.Schema";

const router = express.Router();

router.route("/signup").post(validateRequest(SignUpSchema), SignUp);
router.route("/login").post(validateRequest(LoginSchema), login);

export default router;
