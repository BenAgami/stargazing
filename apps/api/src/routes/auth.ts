import { Router } from "express";
import z from "zod";

import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  logoutSchema,
} from "@repo/common";

import validateSchema from "../middlewares/validateSchema";
import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} from "../controllers/auth";

const router: Router = Router();

router.post(
  "/register",
  validateSchema(z.object({ body: registerSchema })),
  registerUser,
);

router.post(
  "/login",
  validateSchema(z.object({ body: loginSchema })),
  loginUser,
);

router.post(
  "/refresh",
  validateSchema(z.object({ body: refreshTokenSchema })),
  refreshUserToken,
);

router.post(
  "/logout",
  validateSchema(z.object({ body: logoutSchema })),
  logoutUser,
);

export default router;
