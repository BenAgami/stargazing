import { z } from "zod";

import { registry } from "../registry";

import {
  UpdateProfileBody,
  UpsertGoalBody,
  UserProfileResponse,
  UpdateProfileResponse,
  GoalResponse,
  AvatarUploadUrlResponse,
  successResponse,
  errorResponse,
} from "../schemas";

const bearerAuth = { BearerAuth: [] };

registry.registerPath({
  method: "get",
  path: "/users/me",
  tags: ["Users"],
  summary: "Get current user profile",
  security: [bearerAuth],
  responses: {
    200: successResponse(UserProfileResponse, "Current user profile"),
    401: errorResponse("Unauthorized"),
    404: errorResponse("User not found"),
    500: errorResponse("Internal server error"),
  },
});

registry.registerPath({
  method: "patch",
  path: "/users/me",
  tags: ["Users"],
  summary: "Update current user profile",
  security: [bearerAuth],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: UpdateProfileBody } },
    },
  },
  responses: {
    200: successResponse(UpdateProfileResponse, "Updated user profile"),
    400: errorResponse("Validation error"),
    401: errorResponse("Unauthorized"),
    404: errorResponse("User not found"),
    409: errorResponse("Username already taken"),
    500: errorResponse("Internal server error"),
  },
});

registry.registerPath({
  method: "post",
  path: "/users/me/avatar-upload-url",
  tags: ["Users"],
  summary: "Get presigned S3 URL for avatar upload",
  security: [bearerAuth],
  responses: {
    200: successResponse(AvatarUploadUrlResponse, "Presigned upload URL"),
    401: errorResponse("Unauthorized"),
    500: errorResponse("Internal server error"),
  },
});

registry.registerPath({
  method: "post",
  path: "/users/me/goals",
  tags: ["Users"],
  summary: "Create a goal for the current user",
  security: [bearerAuth],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: UpsertGoalBody } },
    },
  },
  responses: {
    201: successResponse(GoalResponse, "Goal created"),
    400: errorResponse("Validation error"),
    401: errorResponse("Unauthorized"),
    404: errorResponse("User not found"),
    500: errorResponse("Internal server error"),
  },
});

registry.registerPath({
  method: "get",
  path: "/users/{uuid}",
  tags: ["Users"],
  summary: "Get a user profile by UUID",
  security: [bearerAuth],
  request: {
    params: z.object({
      uuid: z.uuid().openapi({ description: "User UUID (v7)" }),
    }),
  },
  responses: {
    200: successResponse(UserProfileResponse, "User profile"),
    400: errorResponse("Invalid UUID"),
    401: errorResponse("Unauthorized"),
    404: errorResponse("User not found"),
    500: errorResponse("Internal server error"),
  },
});
