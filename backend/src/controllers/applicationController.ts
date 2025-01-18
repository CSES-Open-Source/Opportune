import Application from "src/models/Application";
import { Status } from "src/models/Application";
import { matchedData, validationResult } from "express-validator";
import validationErrorParser from "src/util/validationErrorParser";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

// Interface for creating/updating an application
// @interface CreateApplicationRequest
interface ApplicationCreate {
  userId: string;
  companyId: string;
  companyName?: string;
  position: string;
  link?: string;
  location?: string;
  process?: Array<{
    status: Status;
    date: string | Date;
    note?: string;
  }>;
}
interface ApplicationUpdate extends Partial<ApplicationCreate> {}

// @desc Retrieve all applications
// @route GET /api/applications/applied
// @access Private
//
// @returns {Application[]} 200 - Array of applications
export const getAllApplications = asyncHandler(async (req, res, _) => {
  // Retrieve all applications from the database
  const applications = await Application.find().lean().exec();

  res.status(200).json(applications);
});

//  @desc Create a new application
//  @route POST /api/applications/applied
//  @access Private
//
//  @param {CreateApplicationRequest} req.body - Application creation data (can use custom ts interface)
//  @returns {Application} 201 - Created application
//  @throws {400} - If required fields are missing
export const createApplication = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract validated data from the request body
  const applicationData = matchedData(req) as ApplicationCreate;

  // Check if an application with the same userId, companyId, and position already exists
  const existingApplication = await Application.findOne({
    userId: applicationData.userId,
    companyId: applicationData.companyId,
    position: applicationData.position,
  })
    .lean()
    .exec();

  if (existingApplication) {
    return next(createHttpError(409, "Application already exists"));
  }

  // Create a new application with the validated data
  const newApplication = new Application(applicationData);
  await newApplication.save();

  res.status(201).json(newApplication);
});

//  @desc Get application by ID
//  @route GET /api/applications/applied/:id
//  @access Private
//
//  @param {string} id.path.required - Application ID
//  @returns {Application} 200 - Found application
//  @throws {404} - If application not found
//  @throws {400} - If ID is invalid
export const getApplicationByID = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract the validated 'id' from request parameters
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Find the application by ID
  const application = await Application.findById(id).lean().exec();

  if (!application) {
    return next(createHttpError(404, "Application not found."));
  }

  res.status(200).json(application);
});

//  @desc Update application by ID
//  @route PATCH /api/applications/applied/:id
//  @access Private
//
//  @param {string} id.path.required - Application ID
//  @param {Partial<CreateApplicationRequest>} req.body - Fields to update (could use custom ts interface)
//  @returns {Application} 200 - Updated application
//  @throws {404} - If application not found
//  @throws {400} - If ID is invalid
export const updateApplicationByID = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract the validated 'id' from request parameters
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Extract the validated fields to update from request body
  const validatedData = matchedData(req, {
    locations: ["body"],
  }) as ApplicationUpdate;

  if (Object.keys(validatedData).length === 0) {
    // If no fields are provided to update, return a 400 Bad Request
    return next(
      createHttpError(400, "At least one field is required to update."),
    );
  }

  // Update the application with the provided data
  const updatedApplication = await Application.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true },
  );

  if (!updatedApplication) {
    return next(createHttpError(404, "Application not found."));
  }

  res.status(200).json(updatedApplication);
});

//  @desc Delete application by ID
//  @route DELETE /api/applications/applied/:id
//  @access Private
//
//  @param {string} id.path.required - Application ID
//  @returns {Object} 200 - Success message and deleted application
//  @throws {404} - If application not found
//  @throws {400} - If ID is invalid
export const deleteApplicationByID = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract the validated 'id' from request parameters
  const { id } = matchedData(req, { locations: ["params"] }) as { id: string };

  // Find and delete the application by ID
  const application = await Application.findByIdAndDelete(id).lean().exec();

  if (!application) {
    return next(createHttpError(404, "Application not found."));
  }

  res.status(200).json(application);
});

//  @desc Get applications by user ID
//  @route GET /api/applications/applied/user/:id?query=[query]&status=[status]&sortBy=[sortBy]
//  @access Private
//
//  @param {string} userId.path.required - User ID
//  @returns {Application[]} 200 - Array of user's applications
//  @throws {404} - If no applications found for user
//  @throws {400} - If user ID is invalid
export const getApplicationsByUserID = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { query, status, sortBy } = req.query;
});
