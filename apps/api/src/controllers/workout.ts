import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type {
  CreateWorkoutValues,
  UpdateWorkoutValues,
  WorkoutLogValues,
} from "@repo/common";

import asyncHandler from "../utils/asyncWrapper";
import requireUserUuid from "../utils/requireUserUuid";

import workoutService from "../services/workoutService";

type ListWorkoutsQuery = {
  limit?: string;
  offset?: string;
};

type WorkoutIdParam = {
  id: string;
};

/**
 * List workouts for current user
 * @route GET /api/workouts
 */
export const listWorkouts = asyncHandler(
  async (
    req: Request<WorkoutIdParam, unknown, unknown, ListWorkoutsQuery>,
    res: Response,
  ) => {
    const userUuid = requireUserUuid(req, res);
    if (!userUuid) return;

    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    const result = await workoutService.listWorkouts({
      userUuid,
      limit,
      offset,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Workouts retrieved successfully",
      data: result,
    });
  },
);

/**
 * Get workout by id
 * @route GET /api/workouts/:id
 */
export const getWorkoutById = asyncHandler(
  async (req: Request<WorkoutIdParam>, res: Response) => {
    const userUuid = requireUserUuid(req, res);
    if (!userUuid) return;
    const workoutId = Number(req.params.id);
    const workout = await workoutService.getWorkoutById(userUuid, workoutId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Workout retrieved successfully",
      data: workout,
    });
  },
);

/**
 * Create workout
 * @route POST /api/workouts
 */
export const createWorkout = asyncHandler(
  async (
    req: Request<WorkoutIdParam, unknown, CreateWorkoutValues>,
    res: Response,
  ) => {
    const userUuid = requireUserUuid(req, res);
    if (!userUuid) return;
    const workout = await workoutService.createWorkout(userUuid, req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Workout created successfully",
      data: workout,
    });
  },
);

/**
 * Update workout
 * @route PATCH /api/workouts/:id
 */
export const updateWorkout = asyncHandler(
  async (
    req: Request<WorkoutIdParam, unknown, UpdateWorkoutValues>,
    res: Response,
  ) => {
    const userUuid = requireUserUuid(req, res);
    if (!userUuid) return;
    const workoutId = Number(req.params.id);
    const workout = await workoutService.updateWorkout(
      userUuid,
      workoutId,
      req.body,
    );
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Workout updated successfully",
      data: workout,
    });
  },
);

/**
 * Delete workout
 * @route DELETE /api/workouts/:id
 */
export const deleteWorkout = asyncHandler(
  async (req: Request<WorkoutIdParam>, res: Response) => {
    const userUuid = requireUserUuid(req, res);
    if (!userUuid) return;
    const workoutId = Number(req.params.id);
    await workoutService.deleteWorkout(userUuid, workoutId);
    res.status(StatusCodes.NO_CONTENT).send();
  },
);

/**
 * Start workout (create log)
 * @route POST /api/workouts/:id/logs
 */
export const startWorkout = asyncHandler(
  async (
    req: Request<WorkoutIdParam, unknown, WorkoutLogValues>,
    res: Response,
  ) => {
    const userUuid = requireUserUuid(req, res);
    if (!userUuid) return;
    const workoutId = Number(req.params.id);
    const log = await workoutService.startWorkoutLog(
      userUuid,
      workoutId,
      req.body,
    );
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Workout started successfully",
      data: log,
    });
  },
);
