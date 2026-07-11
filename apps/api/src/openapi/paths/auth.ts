import { registry } from "../registry";

import {
  LoginBody,
  RegisterBody,
  RefreshTokenBody,
  LogoutBody,
  RegisterResponse,
  LoginResponse,
  RefreshTokenResponse,
  successResponse,
  messageResponse,
  errorResponse,
} from "../schemas";

registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  summary: "Register a new user",
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: RegisterBody } },
    },
  },
  responses: {
    201: successResponse(RegisterResponse, "User registered"),
    400: errorResponse("Validation error"),
    409: errorResponse("Email or username already in use"),
    500: errorResponse("Internal server error"),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Authenticate a user - Login",
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: LoginBody } },
    },
  },
  responses: {
    200: successResponse(LoginResponse, "Login successful"),
    400: errorResponse("Validation error"),
    401: errorResponse("Invalid credentials"),
    500: errorResponse("Internal server error"),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  summary: "Refresh access token",
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: RefreshTokenBody } },
    },
  },
  responses: {
    200: successResponse(RefreshTokenResponse, "Tokens refreshed"),
    400: errorResponse("Validation error"),
    401: errorResponse("Invalid or expired refresh token"),
    500: errorResponse("Internal server error"),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],
  summary: "Logout and revoke refresh token",
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: LogoutBody } },
    },
  },
  responses: {
    200: messageResponse("Logged out successfully"),
    400: errorResponse("Validation error"),
    500: errorResponse("Internal server error"),
  },
});
