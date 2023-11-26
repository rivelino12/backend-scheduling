import express from "express";
import { createSchedule } from "../controllers/Schedule.js";

const router = express.Router();

router.post("/schedule", createSchedule);

export default createSchedule;
