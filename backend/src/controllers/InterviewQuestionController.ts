import InterviewQuestion from "src/models/InterviewQuestion";
import { matchedData, validationResult } from "express-validator";
import validationErrorParser from "src/util/validationErrorParser";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import Company from "src/models/Company";
import mongoose from "mongoose";

// Interface for creating/updating an interview question
interface InterviewQuestionCreate {
  company: mongoose.Types.ObjectId;
  question: string;
  date: Date;
}

interface InterviewQuestionUpdate extends Partial<InterviewQuestionCreate> {}

// @desc Retrieve all interview questions
// @route GET /api/questions/interview/behavioral
// @access Private
//
// @returns {InterviewQuestion[]} 200 - Array of interview questions
export const getAllInterviewQuestions = asyncHandler(async (req, res, _) => {});

// @desc Create a new interview question
// @route POST /api/questions/interview/behavioral
// @access Private
export const createInterviewQuestion = asyncHandler(
  async (req, res, next) => {},
);

// @desc Retrieve interview questions by ID
// @route GET /api/questions/interview/behavioral/:id
// @access Private
//
// @returns {InterviewQuestion} 200 - Interview question
export const getInterviewQuestionById = asyncHandler(
  async (req, res, next) => {},
);

// @desc Retrieve interview questions by company ID
// @route GET /api/questions/interview/behavioral/company/:companyId
// @access Private
//
// @returns {InterviewQuestion[]} 200 - Array of interview questions
export const getInterviewQuestionsByCompanyId = asyncHandler(
  async (req, res, next) => {},
);

// @desc Update interview question by ID
// @route PATCH /api/questions/interview/behavioral/:id
// @access Private
export const updateInterviewQuestion = asyncHandler(
  async (req, res, next) => {},
);

// @desc Delete interview question by ID
// @route DELETE /api/questions/interview/behavioral/:id
// @access Private
export const deleteInterviewQuestion = asyncHandler(
  async (req, res, next) => {},
);
