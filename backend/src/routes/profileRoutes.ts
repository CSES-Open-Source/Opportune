import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  getAlumniProfile,
  updateAlumniProfile,
  createStudentProfile,
  createAlumniProfile,
} from "../controllers/profileController";

const router = express.Router();

router.get("/student/:userId", getStudentProfile);
router.post("/student", createStudentProfile);
router.patch("/student/:userId", updateStudentProfile);

router.get("/alumni/:userId", getAlumniProfile);
router.post("/alumni", createAlumniProfile);
router.patch("/alumni/:userId", updateAlumniProfile);

export default router;
