import { Router } from "express";

import healthRoutes from "./health";
import authRoutes from "./auth";
import userRoutes from "./user";
import workoutSessionRoutes from "./workoutSession";
import exerciseRoutes from "./exercise";
import workoutRoutes from "./workout";

const router: Router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/workout-sessions", workoutSessionRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/workouts", workoutRoutes);

export default router;
