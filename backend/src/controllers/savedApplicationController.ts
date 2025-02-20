import SavedApplication from "src/models/SavedApplication";
import { matchedData, validationResult } from "express-validator";
import validationErrorParser from "src/util/validationErrorParser";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import Company from "src/models/Company";
import mongoose from "mongoose";

// Interface for creating/updating a saved application
// @interface CreateSavedApplicationRequest
interface SavedApplicationCreate {
  userId: string;
  company: mongoose.Types.ObjectId;
  position: string;
  location?: string;
  link?: string;
  materialsNeeded?: string[];
  deadline?: Date;
}

interface SavedApplicationUpdate extends Partial<SavedApplicationCreate> {}

// @desc Retrieve all saved applications with attributes
// @route GET /api/applications/saved
// @access Private
//
// @returns {SavedApplication[]} 200 - Array of saved applications
export const getAllSavedApplications = asyncHandler(async (req, res, _) => {
  // Retrieve all saved applications from the database
  const savedApplications = await SavedApplication.find()
    .populate({ path: "company", model: Company })
    .lean()
    .exec();

  res.status(200).json(savedApplications);
});

//  @desc Create a new saved application
//  @route POST /api/applications/saved
//  @access Private
export const createSavedApplication = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract validated data from the request body
  const savedApplicationData = matchedData(req) as SavedApplicationCreate;

  // Check if an application with the same userId, company, and position already exists
  const existingSavedApplication = await SavedApplication.findOne({
    userId: savedApplicationData.userId,
    company: savedApplicationData.company,
    position: savedApplicationData.position,
    location: savedApplicationData.location,
  })
    .lean()
    .exec();

  if (existingSavedApplication) {
    return next(createHttpError(409, "Saved application already exists."));
  }

  // Create a new application with the validated data
  const newSavedApplication = new SavedApplication(savedApplicationData);
  await newSavedApplication.save();

  res.status(200).json(newSavedApplication);
});

//  @desc Get saved application by ID
//  @route GET /api/applications/saved/:id
//  @access Private
//
//  @param {string} id - Saved Application ID
export const getSavedApplicationByID = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract the validated "id" from request parameters
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Find the application by ID
  const savedApplication = await SavedApplication.findById(id)
    .populate({ path: "company", model: Company })
    .lean()
    .exec();

  if (!savedApplication) {
    return next(createHttpError(404, "Saved application not found."));
  }

  res.status(200).json(savedApplication);
});

//  @desc Update saved application by ID
//  @route PATCH /api/applications/saved/:id
//  @access Private
//
//  @param {string} id - Saved Application ID
export const updateSavedApplicationByID = asyncHandler(
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, validationErrorParser(errors)));
    }

    // Extract the validated "id" from request parameters
    const { id } = matchedData(req, { locations: ["params"] }) as {
      id: string;
    };

    // Extract the validated fields to update from request body
    const validatedData = matchedData(req, {
      locations: ["body"],
    }) as SavedApplicationUpdate;

    if (Object.keys(validatedData).length === 0) {
      // If no fields are provided to update, return a 400 Bad Request
      return next(
        createHttpError(400, "At least one field is required to update."),
      );
    }

    // Update the application with the provided data
    const updatedSavedApplication = await SavedApplication.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true },
    );

    if (!updatedSavedApplication) {
      return next(createHttpError(404, "Saved application not found."));
    }

    res.status(200).json(updatedSavedApplication);
  },
);

//  @desc Delete saved application by ID
//  @route DELETE /api/applications/saved/:id
//  @access Private
//
//  @param {string} id - Saved Application ID
export const deleteSavedApplicationByID = asyncHandler(
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, validationErrorParser(errors)));
    }

    // Extract the validated 'id' from request parameters
    const { id } = matchedData(req, { locations: ["params"] }) as {
      id: string;
    };

    // Find and delete the application by ID
    const savedApplication = await SavedApplication.findByIdAndDelete(id);

    if (!savedApplication) {
      return next(createHttpError(404, "Saved application not found."));
    }

    res.status(200).json(savedApplication);
  },
);

//  @desc Get saved applications by user ID
//  @route GET /api/applications/saved/user/:userId?query=[query]&sortBy=[sortBy]&page=[page]&perPage=[perPage]
//  @access Private
//
//  @param {string} userId - User ID
export const getSavedApplicationsByUserID = asyncHandler(
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, validationErrorParser(errors)));
    }

    // Extract the validated "id" from request parameters
    const { id } = matchedData(req, { locations: ["params"] }) as {
      id: string;
    };

    // Extract the validated fields to update from request query
    const { query, sortBy, page, perPage } = matchedData(req, {
      locations: ["query"],
    });

    const dbQuery = SavedApplication.find({
      userId: id,
      ...(query && {
        $or: [
          { "company.name": { $regex: query, $options: "i" } },
          { position: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
        ],
      }),
    });

    // Apply sorting if `sortBy` is provided
    if (sortBy) {
      dbQuery.sort(sortBy);
    }

    // ensure count and paginate do not conflict
    const countQuery = dbQuery.clone();

    // count total results, populate company, and paginate in parallel
    const [total, applications] = await Promise.all([
      countQuery.countDocuments(),
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
      data: applications.map((app) => ({
        userId: app.userId,
        company: app.company,
        position: app.position,
        location: app.location,
        link: app.link,
        materialsNeeded: app.materialsNeeded,
        deadline: app.deadline,
      })),
    });
  },
);
