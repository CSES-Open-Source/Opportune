/* eslint-disable no-unused-vars */

import LeetcodeQuestion from "src/models/LeetcodeQuestion";
import asyncHandler from "express-async-handler";

// @desc Get Leetcode questions matching the query
// @route GET /api/questions/leetcode
// @access Private
export const getLeetcodeQuestions = asyncHandler(async (req, res, next) => {});

// @desc Create a new Leetcode question
// @route POST /api/questions/leetcode
// @access Private
export const createLeetcodeQuestion = asyncHandler(
  async (req, res, next) => {},
);

// @desc Get Leetcode question by ID
// @route GET /api/questions/leetcode/:id
// @access Private
export const getLeetcodeQuestionById = asyncHandler(
  async (req, res, next) => {},
);

// @desc Update Leetcode question by ID
// @route PATCH /api/questions/leetcode/:id
// @access Private
export const updateLeetcodeQuestion = asyncHandler(
  async (req, res, next) => {},
);

// @desc Delete Leetcode question by ID
// @route DELETE /api/questions/leetcode/:id
// @access Private
export const deleteLeetcodeQuestion = asyncHandler(
  async (req, res, next) => {},
);

// @desc Get Leetcode question by company ID
// @route GET /api/questions/leetcode/company/:companyId
// @access Private
export const getLeetcodeQuestionByCompanyId = asyncHandler(
  async (req, res, next) => {},
);
