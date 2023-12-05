import express from "express";
import {
  addImageToSubSchedule,
  createSchedule,
  getCountByClass,
  getScheduleById,
  getSchedules,
} from "../controllers/Schedule.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/schedules", verifyUser, getSchedules);
router.post("/schedule", createSchedule);
router.get("/schedule/:id", verifyUser, getScheduleById);
router.get("/schedule/count/:classType", getCountByClass);
router.patch("/schedule/sub-schedule/add-image/:id", addImageToSubSchedule);

export default router;
