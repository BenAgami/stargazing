import { Router } from "express";

import healthRoutes from "./health";
import userRoutes from "./user";
import sessionRoutes from "./session";
import exerciseRoutes from "./exercise";
import workoutRoutes from "./workout";

const router: Router = Router();

router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/sessions", sessionRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/workouts", workoutRoutes);

export default router;
