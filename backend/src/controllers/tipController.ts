import Tip from "../models/Tips";
import { matchedData, validationResult } from "express-validator";
import validationErrorParser from "../util/validationErrorParser";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { Schema } from "mongoose";
import Company from "../models/Company";
import User from "../models/User";

// Interface for creating/updating a tip
interface TipCreate {
  user: string;
  company: Schema.Types.ObjectId;
  text: string;
}

interface TipUpdate extends Partial<TipCreate> {}

// @desc Retrieve all tips
// @route GET /api/tips
// @access Private
//
// @returns {Tip[]} 200 - Array of tips
export const getAllTips = asyncHandler(async (req, res, _) => {
  // Retrieve all tips from the database
  const tips = await Tip.find()
    .populate({ path: "company", model: Company })
    .populate({ path: "user", model: User })
    .lean()
    .exec();

  res.status(200).json(tips);
});

// @desc Create a new tip
// @route POST /api/tips
// @access Private
//
// @param {TipCreate} req.body - Tip creation data
// @returns {Tip} 201 - Created tip
// @throws {400} - If required fields are missing
export const createTip = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract validated data from the request body
  const tipData = matchedData(req) as TipCreate;

  // Create a new tip with the validated data
  const newTip = new Tip(tipData);

  await newTip.save();

  const populatedTip = await Tip.findById(newTip._id)
    .populate({ path: "company", model: Company })
    .populate({ path: "user", model: User })
    .lean()
    .exec();

  res.status(201).json(populatedTip);
});

// @desc Get tip by ID
// @route GET /api/tips/:id
// @access Private
//
// @param {string} id.path.required - Tip ID
// @returns {Tip} 200 - Found tip
// @throws {404} - If tip not found
// @throws {400} - If ID is invalid
export const getTipById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract the validated 'id' from request parameters
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Find the tip by ID
  const tip = await Tip.findById(id)
    .populate({ path: "company", model: Company })
    .populate({ path: "user", model: User })
    .lean()
    .exec();

  if (!tip) {
    return next(createHttpError(404, "Tip not found."));
  }

  res.status(200).json(tip);
});

// @desc Update tip by ID
// @route PATCH /api/tips/:id
// @access Private
//
// @param {string} id.path.required - Tip ID
// @param {TipUpdate} req.body - Fields to update
// @returns {Tip} 200 - Updated tip
// @throws {404} - If tip not found
// @throws {400} - If ID is invalid or no fields provided
export const updateTipById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract the validated 'id' from request parameters
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Extract the validated fields to update from request body
  const validatedData = matchedData(req, {
    locations: ["body"],
  }) as TipUpdate;

  if (Object.keys(validatedData).length === 0) {
    // If no fields are provided to update, return a 400 Bad Request
    return next(
      createHttpError(400, "At least one field is required to update."),
    );
  }

  // Update the tip with the provided data
  const updatedTip = await Tip.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true },
  )
    .populate({ path: "company", model: Company })
    .populate({ path: "user", model: User })
    .lean()
    .exec();

  if (!updatedTip) {
    return next(createHttpError(404, "Tip not found."));
  }

  res.status(200).json(updatedTip);
});

// @desc Delete tip by ID
// @route DELETE /api/tips/:id
// @access Private
//
// @param {string} id.path.required - Tip ID
// @returns {Object} 200 - Success message and deleted tip
// @throws {404} - If tip not found
// @throws {400} - If ID is invalid
export const deleteTipById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract the validated 'id' from request parameters
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Find and delete the tip by ID
  const tip = await Tip.findByIdAndDelete(id).exec();

  if (!tip) {
    return next(createHttpError(404, "Tip not found."));
  }

  res.status(200).json("Successfully deleted tip.");
});

// @desc Get tips by company ID
// @route GET /api/tips/company/:id
// @access Private
//
// @param {string} id.path.required - Company ID
// @param {number} page.query - Page number (default: 0)
// @param {number} perPage.query - Items per page (default: 10)
// @returns {Object} 200 - Object containing tips and pagination info
// @throws {400} - If company ID is invalid
export const getTipsByCompanyId = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract params and query parameters
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Find tips for the specified company with pagination
  const tips = await Tip.find({ company: id })
    .populate({ path: "company", model: Company })
    .populate({ path: "user", model: User })
    .lean()
    .exec();

  res.status(200).json(tips);
});
