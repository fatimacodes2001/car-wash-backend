import { Router } from "express";
import { register, login } from "../controllers/userController";
import asyncHandler from "../middlewares/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

export default router;
