import InterviewQuestion from "src/models/InterviewQuestion";
import { matchedData, validationResult } from "express-validator";
import validationErrorParser from "src/util/validationErrorParser";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import Company from "src/models/Company";
import mongoose from "mongoose";
import User from "src/models/User";

// Interface for creating/updating an interview question
interface InterviewQuestionCreate {
  company: mongoose.Types.ObjectId;
  question: string;
  date: Date;
}

interface InterviewQuestionUpdate extends Partial<InterviewQuestionCreate> {}

// @desc Retrieve all interview questions
// @route GET /api/questions/interview
// @access Private
//
// @returns {InterviewQuestion[]} 200 - Array of interview questions
export const getAllInterviewQuestions = asyncHandler(async (req, res, _) => {
  // TODO: Implement with paginated date, for now it will just return all interview questions for testing
  const interviewQuestions = await InterviewQuestion.find()
    .populate({ path: "company", model: Company })
    .populate({ path: "user", model: User })
    .lean()
    .exec();

  res.status(200).json(interviewQuestions);
});

// @desc Create a new interview question
// @route POST /api/questions/interview
// @access Private
export const createInterviewQuestion = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract validated data from request body
  const interviewQuestionData = matchedData(req) as InterviewQuestionCreate;

  // Check if interview question with same title exists
  const existingInterviewQuestion = await InterviewQuestion.findOne({
    question: interviewQuestionData.question,
  })
    .lean()
    .exec();

  if (existingInterviewQuestion) {
    return next(createHttpError(409, "Interview Question already exists"));
  }

  // Create new interview question with validated data
  const newInterviewQuestion = new InterviewQuestion(interviewQuestionData);
  await newInterviewQuestion.save();

  const populatedInterviewQuestion = await InterviewQuestion.findOne({
    question: interviewQuestionData.question,
  })
    .populate({ path: "company", model: Company })
    .populate({ path: "user", model: User })
    .lean()
    .exec();

  if (!populatedInterviewQuestion) {
    return next(
      createHttpError(500, "Failed to populate company after user creation."),
    );
  }

  res.status(201).json(populatedInterviewQuestion);
});

// @desc Retrieve interview questions by ID
// @route GET /api/questions/interview/:id
// @access Private
//
// @returns {InterviewQuestion} 200 - Interview question
export const getInterviewQuestionById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract validated id parameter from request
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Find interview question by ID
  const interviewQuestion = await InterviewQuestion.findById(id)
    .populate({ path: "company", model: Company })
    .populate({ path: "user", model: User })
    .lean()
    .exec();

  if (!interviewQuestion) {
    return next(createHttpError(404, "Interview question not found"));
  }

  res.status(200).json(interviewQuestion);
});

// @desc Retrieve interview questions by company ID
// @route GET /api/questions/interview/company/:companyId
// @access Private
//
// @returns {InterviewQuestion[]} 200 - Array of interview questions
export const getInterviewQuestionsByCompanyId = asyncHandler(
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, validationErrorParser(errors)));
    }

    // Extract validated Company Id parameter from request
    const { companyId } = matchedData(req, { locations: ["params"] }) as {
      companyId: string;
    };

    const interviewQuestions = await InterviewQuestion.find({
      company: companyId,
    })
      .populate({ path: "company", model: Company })
      .populate({ path: "user", model: User })
      .lean()
      .exec();

    res.status(200).json(interviewQuestions);
  },
);

// @desc Update interview question by ID
// @route PATCH /api/questions/interview/:id
// @access Private
export const updateInterviewQuestion = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract id parameter from request
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Extract validated fields to update from request body
  const validatedData = matchedData(req, {
    locations: ["body"],
  }) as InterviewQuestionUpdate;

  if (Object.keys(validatedData).length === 0) {
    // If no fields are provided to update, return a 400 Bad Request
    return next(
      createHttpError(400, "At least one field is required to update"),
    );
  }

  // Check if another interview question with same title exists
  const existingInterviewQuestion = await InterviewQuestion.findOne({
    question: validatedData.question,
    _id: { $ne: id },
  })
    .lean()
    .exec();

  if (existingInterviewQuestion) {
    return next(createHttpError(409, "Repeat Interview Question title"));
  }

  // Update interview question with provided data
  const updatedInterviewQuestion = await InterviewQuestion.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true },
  )
    .populate({ path: "company", model: Company })
    .populate({ path: "user", model: User })
    .lean()
    .exec();

  if (!updatedInterviewQuestion) {
    return next(createHttpError(404, "Interview Question not found"));
  }

  res.status(200).json(updatedInterviewQuestion);
});

// @desc Delete interview question by ID
// @route DELETE /api/questions/interview/:id
// @access Private
export const deleteInterviewQuestion = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract id parameter from request
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Find and delete interview question by ID
  await InterviewQuestion.findByIdAndDelete(id).exec();

  res.status(200);
});
