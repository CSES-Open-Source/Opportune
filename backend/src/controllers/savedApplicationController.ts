import SavedApplication from "src/models/SavedApplication";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

// @desc Retrieve all saved applications with attributes
// @route GET /api/applications/saved
// @access Private
//
// @returns {SavedApplication[]} 200 - Array of saved applications
export const getAllSavedApplications = asyncHandler(async (req, res, _) => {
  // Retrieve all saved applications from the database
  const savedApplications = await SavedApplication.find().lean().exec();

  res.status(200).json(savedApplications);
});

//  @desc Create a new saved application
//  @route POST /api/applications/saved
//  @access Private
export const createSavedApplication = asyncHandler(async (req, res, next) => {
  const { userId, companyId, companyName, link, materialsNeeded, deadline } =
    req.body;
});

//  @desc Get saved application by ID
//  @route GET /api/applications/saved/:id
//  @access Private
//
//  @param {string} id - Saved Application ID
export const getSavedApplicationByID = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
});

//  @desc Update saved application by ID
//  @route PATCH /api/applications/saved/:id
//  @access Private
//
//  @param {string} id - Saved Application ID
export const updateSavedApplicationByID = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { link, materialsNeeded, deadline } = req.body; // fields are optional
  },
);

//  @desc Delete saved application by ID
//  @route DELETE /api/applications/saved/:id
//  @access Private
//
//  @param {string} id - Saved Application ID
export const deleteSavedApplicationByID = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
  },
);

//  @desc Get saved application by user ID
//  @route GET /api/applications/saved/user/:userId?query=[query]&sortBy=[sortBy]&page=[page]&perPage=[perPage]
//  @access Private
//
//  @param {string} userId - User ID
export const getSavedApplicationsByUserID = asyncHandler(
  async (req, res, next) => {
    const { userId } = req.params;
    const { query, sortBy, page, perPage } = req.query;
  },
);
