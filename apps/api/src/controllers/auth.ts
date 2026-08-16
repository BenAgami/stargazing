import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  RegisterValues,
  LoginValues,
  RefreshTokenValues,
  LogoutValues,
} from "@repo/common";

import authService from "../services/authService";
import refreshTokenService from "../services/refreshTokenService";

import asyncHandler from "../utils/asyncWrapper";

/**
 * Register a new user
 * @route POST /api/auth/register
 * @param {Request} req - Express request object with name, email, and password in body
 * @param {Response} res - Express response object
 * @returns {Object} Created user, access token, and refresh token
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body as RegisterValues;

    const { user, token, refreshToken } = await authService.register({
      name,
      email,
      password,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: { user, token, refreshToken },
    });
  },
);

/**
 * Login user
 * @route POST /api/auth/login
 * @param {Request} req - Express request object with email and password in body
 * @param {Response} res - Express response object
 * @returns {Object} User data, access token, and refresh token
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginValues;

  const { user, token, refreshToken } = await authService.login({
    email,
    password,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User logged in successfully",
    data: { user, token, refreshToken },
  });
});

/**
 * Refresh access token using a valid refresh token
 * @route POST /api/auth/refresh
 * @param {Request} req - Express request object with refreshToken in body
 * @param {Response} res - Express response object
 * @returns {Object} New access token and rotated refresh token
 */
export const refreshUserToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body as RefreshTokenValues;

    const { token, refreshToken: newRefreshToken } =
      await authService.refresh(refreshToken);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Token refreshed successfully",
      data: { token, refreshToken: newRefreshToken },
    });
  },
);

/**
 * Logout by revoking the refresh token
 * @route POST /api/auth/logout
 * @param {Request} req - Express request object with refreshToken in body
 * @param {Response} res - Express response object
 * @returns {Object} Success message
 */
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as LogoutValues;

  await refreshTokenService.revokeToken(refreshToken);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Logged out successfully",
  });
});
