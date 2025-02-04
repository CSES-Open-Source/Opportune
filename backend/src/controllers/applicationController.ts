import Application from "src/models/Application";
import { Status } from "src/models/Application";
import { matchedData, validationResult } from "express-validator";
import validationErrorParser from "src/util/validationErrorParser";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import Company from "src/models/Company";
import mongoose from "mongoose";

// Interface for MongoDB query to fetch applications based on certain conditions
// @interface getApplicationsByUserID
interface ApplicationQuery {
  userId: string;
  $or?: { [key: string]: { $regex: string; $options: string } }[];
  "process.status"?: { $in: string[] };
}

// Interface for creating/updating an application
// @interface CreateApplicationRequest
interface ApplicationCreate {
  userId: string;
  company: mongoose.Types.ObjectId;
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
  const applications = await Application.find()
    .populate({ path: "company", model: Company })
    .lean()
    .exec();

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

  // Check if an application with the same userId, company, and position already exists
  const existingApplication = await Application.findOne({
    userId: applicationData.userId,
    company: applicationData.company,
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
  const application = await Application.findById(id)
    .populate({ path: "company", model: Company })
    .lean()
    .exec();

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
//  @route GET /api/applications/applied/user/:userId?query=[query]&status=[status]&sortBy=[sortBy]
//  @access Private
//
//  @param {string} userId.path.required - User ID
//  @returns {Application[]} 200 - Array of user's applications
//  @throws {404} - If no applications found for user
//  @throws {400} - If user ID is invalid
export const getApplicationsByUserID = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  // Extract query parameters with default values
  const {
    userId,
    query,
    status,
    sortBy = "createdAt",
    page = 0,
    perPage = 10,
  } = matchedData(req, {
    locations: ["params", "query"],
  });

  // Get applications from specific users
  const dbQuery: ApplicationQuery = { userId };

  // Convert status to an array
  const statusArray = status ? (Array.isArray(status) ? status : [status]) : [];

  // Search query provided then filter by position & companyName
  if (query) {
    dbQuery.$or = [
      { position: { $regex: query, $options: "i" } },
      { companyName: { $regex: query, $options: "i" } },
    ];
  }

  // If status filter is provided and non empty then filter by status
  if (statusArray.length > 0) {
    dbQuery["process.status"] = { $in: statusArray };
  }

  // The sorting logic depending on the query
  let sortOptions = {};
  switch (sortBy) {
    case "createdAt":
      sortOptions = { createdAt: -1 };
      break;
    case "updatedAt":
      sortOptions = { updatedAt: -1 };
      break;
    case "process":
      sortOptions = { "process.date": -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  // Build up the result that will be outputted (Aggregation)
  const applications = await Application.aggregate([
    { $match: dbQuery },
    { $addFields: { latestProcessDate: { $max: "$process.date" } } },
    { $sort: sortOptions },
    { $skip: page * perPage },
    { $limit: perPage },
    {
      $project: {
        userId: 1,
        companyName: 1,
        position: 1,
        process: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  // Count total documents found from query
  const total = await Application.countDocuments(dbQuery);

  // Handle no the scenario where no applications are found
  if (!applications || total == 0) {
    return next(
      createHttpError(404, "No applications found that satisfy the query."),
    );
  }

  res.status(200).json({
    page,
    perPage,
    total,
    data: applications,
  });
});
