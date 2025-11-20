import LeetcodeQuestion from "../models/LeetcodeQuestion";
import { Difficulty } from "../models/LeetcodeQuestion";
import asyncHandler from "express-async-handler";
import { matchedData, validationResult } from "express-validator";
import validationErrorParser from "../util/validationErrorParser";
import createHttpError from "http-errors";
import Company from "../models/Company";
import mongoose from "mongoose";

// interface for creating/updating leetcodeQuestions
interface leetcodeQuestionCreate {
  company: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  url: string;
  difficulty: Difficulty;
  date?: Date;
}

interface leetcodeQuestionUpdate extends Partial<leetcodeQuestionCreate> {}

// @desc Get Leetcode questions matching the query
// @route GET /api/questions/leetcode
// @access Private
export const getLeetcodeQuestions = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { page, perPage, query, sortBy, difficulty } = matchedData(req, {
    locations: ["query"],
  });

  // Begin query
  const dbQuery = LeetcodeQuestion.find();

  // Search by title if provided
  if (query) {
    dbQuery.where("title").regex(new RegExp(query, "i"));
  }

  // Filter by difficulty if provided
  if (difficulty) {
    dbQuery.where("difficulty").equals(difficulty);
  }

  // Sort by sortBy if provided
  if (sortBy) {
    dbQuery.sort(sortBy);
  }

  // Create clone to prevent pagination changes to original
  const countQuery = dbQuery.clone();

  // Execute count and paginate in parallel
  const [total, leetcodeQuestions] = await Promise.all([
    countQuery.countDocuments().exec(),
    dbQuery
      .skip(page * perPage)
      .limit(perPage)
      .populate({ path: "company", model: Company })
      .lean()
      .exec(),
  ]);

  res.status(200).json({
    page,
    perPage,
    total,
    data: leetcodeQuestions,
  });
});

// @desc Create a new Leetcode question
// @route POST /api/questions/leetcode
// @access Private
export const createLeetcodeQuestion = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract validated data from request body
  const leetcodeQuestionData = matchedData(req) as leetcodeQuestionCreate;

  // Check if leetcodeQuestion with same title or url exists
  const existingLeetcodeQuestion = await LeetcodeQuestion.findOne({
    title: leetcodeQuestionData.title,
    url: leetcodeQuestionData.url,
  })
    .lean()
    .exec();

  if (existingLeetcodeQuestion) {
    return next(createHttpError(409, "Leetcode Question already exists"));
  }

  // Create new leetcodeQuestion with validated data
  const newLeetcodeQuestion = new LeetcodeQuestion(leetcodeQuestionData);
  await newLeetcodeQuestion.save();

  const populatedLeetcodeQuestion = await LeetcodeQuestion.findById(
    newLeetcodeQuestion._id,
  )
    .populate({ path: "company", model: Company })
    .lean()
    .exec();

  if (!populatedLeetcodeQuestion) {
    return next(
      createHttpError(500, "Failed to populate company after user creation."),
    );
  }

  res.status(201).json(populatedLeetcodeQuestion);
});

// @desc Get Leetcode question by ID
// @route GET /api/questions/leetcode/:id
// @access Private
export const getLeetcodeQuestionById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract validated id parameter from request
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Find leetcodeQuestion by ID
  const leetcodeQuestion = await LeetcodeQuestion.findById(id)
    .populate({ path: "company", model: Company })
    .lean()
    .exec();

  if (!leetcodeQuestion) {
    return next(createHttpError(404, "Leetcode Question not found"));
  }

  res.status(200).json(leetcodeQuestion);
});

// @desc Update Leetcode question by ID
// @route PATCH /api/questions/leetcode/:id
// @access Private
export const updateLeetcodeQuestion = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract id parameter from request
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Extract validated fields to update from request body
  const validatedData = matchedData(req, {
    locations: ["body"],
  }) as leetcodeQuestionUpdate;

  if (Object.keys(validatedData).length === 0) {
    // If no fields are provided to update, return a 400 Bad Request
    return next(
      createHttpError(400, "At least one field is required to update"),
    );
  }

  // Update leetcodeQuestion with provided data
  const updatedLeetcodeQuestion = await LeetcodeQuestion.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true },
  )
    .populate({ path: "company", model: Company })
    .lean()
    .exec();

  if (!updatedLeetcodeQuestion) {
    return next(createHttpError(404, "Leetcode Question not found"));
  }

  res.status(200).json(updatedLeetcodeQuestion);
});

// @desc Delete Leetcode question by ID
// @route DELETE /api/questions/leetcode/:id
// @access Private
export const deleteLeetcodeQuestion = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract id parameter from request
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Find and delete leetcode question by ID
  await LeetcodeQuestion.findByIdAndDelete(id).lean().exec();

  res.status(200).json({ message: "Success" });
});

// @desc Get Leetcode question by company ID
// @route GET /api/questions/leetcode/company/:companyId
// @access Private
export const getLeetcodeQuestionByCompanyId = asyncHandler(
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(createHttpError(400, validationErrorParser(errors)));
    }

    // Extract validated Company Id parameter from request
    const { companyId } = matchedData(req, { locations: ["params"] }) as {
      companyId: string;
    };

    const leetcodeQuestions = await LeetcodeQuestion.find({
      company: companyId,
    })
      .populate({ path: "company", model: Company })
      .lean()
      .exec();

    res.status(200).json(leetcodeQuestions);
  },
);
