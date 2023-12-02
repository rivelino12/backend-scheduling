import express from "express";
import {
  createSchedule,
  getScheduleById,
  getSchedules,
} from "../controllers/Schedule.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/schedules", verifyUser, getSchedules);
router.post("/schedule", createSchedule);
router.get("/schedule/:id", verifyUser, getScheduleById);

export default router;
