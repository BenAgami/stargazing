import { Router } from "express";
import z from "zod";

import { updateProfileSchema, upsertGoalSchema } from "@repo/common";

import validateSchema from "../middlewares/validateSchema";
import { authenticateToken } from "../middlewares/auth";

import {
  getUserProfile,
  getMyUser,
  updateMyProfile,
  getAvatarUploadUrl,
  createMyGoal,
} from "../controllers/user";

const router: Router = Router();

/**
 * GET /me
 * Get current authenticated user's profile
 */
router.get("/me", authenticateToken, getMyUser);

/**
 * PATCH /me
 * Update current authenticated user's profile
 */
router.patch(
  "/me",
  authenticateToken,
  validateSchema(z.object({ body: updateProfileSchema })),
  updateMyProfile,
);

/**
 * POST /me/avatar-upload-url
 * Get presigned URL for avatar upload
 */
router.post("/me/avatar-upload-url", authenticateToken, getAvatarUploadUrl);

/**
 * POST /me/goals
 * Create a goal for the current authenticated user
 */
router.post(
  "/me/goals",
  authenticateToken,
  validateSchema(z.object({ body: upsertGoalSchema })),
  createMyGoal,
);

/**
 * PATCH /me
 * Update current authenticated user's profile
 */
router.patch(
  "/me",
  authenticateToken,
  validateSchema(z.object({ body: updateProfileSchema })),
  updateMyProfile,
);

/**
 * POST /me/avatar-upload-url
 * Get presigned URL for avatar upload
 */
router.post("/me/avatar-upload-url", authenticateToken, getAvatarUploadUrl);

/**
 * POST /me/goals
 * Create a goal for the current authenticated user
 */
router.post(
  "/me/goals",
  authenticateToken,
  validateSchema(z.object({ body: upsertGoalSchema })),
  createMyGoal,
);

/**
 * GET /:uuid
 * Get user profile by UUID (requires authentication)
 */
router.get(
  "/:uuid",
  authenticateToken,
  validateSchema(z.object({ params: z.object({ uuid: z.uuidv7() }) })),
  getUserProfile,
);

export default router;
