import { Request, Response } from "express";
import Student from "../models/Student";
import Alumni from "../models/Alumni";

export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const studentProfile = await Student.findOne({ userId: req.params.userId });
    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found" });
    }
    res.status(200).json(studentProfile);
  } catch (error) {
    res.status(500).json({ error: "student profile not found" });
  }
};

export const createStudentProfile = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", req.body);
    const studentProfile = await Student.create(req.body);
    res.status(201).json(studentProfile);
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({ error: "unable to create student profile" });
  }
};

export const updateStudentProfile = async (req: Request, res: Response) => {
  try {
    const studentProfile = await Student.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: false },
    );
    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found" });
    }
    res.status(200).json(studentProfile);
  } catch (error) {
    res.status(400).json({ error: "unable to update student profile" });
  }
};

export const getAlumniProfile = async (req: Request, res: Response) => {
  try {
    const alumniProfile = await Alumni.findOne({ userId: req.params.userId });
    if (!alumniProfile) {
      return res.status(404).json({ error: "Alumni profile not found" });
    }
    res.status(200).json(alumniProfile);
  } catch (error) {
    res.status(500).json({ error: "unable to get alumni profile" });
  }
};

export const createAlumniProfile = async (req: Request, res: Response) => {
  try {
    const alumniProfile = await Alumni.create(req.body);
    res.status(201).json(alumniProfile);
  } catch (error) {
    res.status(400).json({ error: "unable to create alumni profile" });
  }
};

export const updateAlumniProfile = async (req: Request, res: Response) => {
  try {
    const alumniProfile = await Alumni.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: false },
    );
    if (!alumniProfile) {
      return res.status(404).json({ error: "Alumni profile not found" });
    }
    res.status(200).json(alumniProfile);
  } catch (error) {
    res.status(400).json({ error: "unable to update alumni profile" });
  }
};
