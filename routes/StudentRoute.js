import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
} from "../controllers/Student.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/students", verifyUser, getStudents);
router.get("/student/:id", verifyUser, getStudentById);
router.patch("/student/:id", verifyUser, adminOnly, updateStudent);
router.post("/student", verifyUser, createStudent);

export default router;
