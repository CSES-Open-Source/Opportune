import { body, param, query } from "express-validator";
import { SortingOptions, Status } from "../models/Application";

// Default values for page and perPage
const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 10;

const validateUserIdParam = param("userId")
  .isString()
  .notEmpty()
  .withMessage("User ID must be a non-empty string");

const validateQuery = query("query")
  .optional()
  .isString()
  .trim()
  .escape()
  .withMessage("Search query must be a string");

const validateStatusQuery = query("status")
  .optional()
  .isString()
  .toUpperCase()
  .custom((value) => {
    const statuses = value.split(",");
    const validStatuses = Object.values(Status);
    for (const s of statuses) {
      if (!validStatuses.includes(s)) {
        throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
      }
    }
    return true;
  });

const validateSortBy = query("sortBy")
  .optional()
  .isIn(Object.values(SortingOptions))
  .withMessage(
    `Sort by must be one of: ${Object.values(SortingOptions).join(", ")}.`,
  );

const validatePage = query("page")
  .default(DEFAULT_PAGE)
  .isInt({ min: 0 })
  .toInt()
  .withMessage("page must be a non-negative integer");

const validatePerPage = query("perPage")
  .default(DEFAULT_PER_PAGE)
  .isInt({ min: 1 })
  .toInt()
  .withMessage("per page must be an integer greater than 1");

const validateId = param("id")
  .isMongoId()
  .withMessage("invalid application id. (Must be a Mongo ObjectID.)")
  .trim();

const validateUserId = body("userId")
  .isString()
  .withMessage("userId must be a string.")
  .trim()
  .notEmpty()
  .withMessage("userId must be a non-empty string.");

const validateCompany = body("company")
  .isMongoId()
  .withMessage("invalid company. (Must be a Mongo ObjectID.)")
  .trim();

const validatePosition = body("position")
  .isString()
  .withMessage("position must be a string.")
  .trim()
  .notEmpty()
  .withMessage("position must be a non-empty string.");

const validateLink = body("link")
  .optional()
  .isURL({
    require_valid_protocol: true,
  })
  .withMessage("link must be a valid URL.")
  .trim();

const validateLocation = body("location")
  .optional()
  .isString()
  .withMessage("location must be a string.")
  .trim();

const validateProcess = [
  body("process")
    .optional()
    .isArray()
    .withMessage("process must be an array of application statuses."),
  body("process.*.status")
    .toUpperCase()
    .isIn(["APPLIED", "OA", "PHONE", "FINAL", "OFFER", "REJECTED"])
    .withMessage(
      "Status must be one of: APPLIED, OA, PHONE, FINAL, OFFER, REJECTED",
    ),
  body("process.*.date")
    .notEmpty()
    .withMessage("each application status must have a date.")
    .bail()
    .isISO8601({ strict: true })
    .withMessage("each application status date must be a valid ISO 8601 date."),
  body("process.*.note")
    .optional()
    .isString()
    .withMessage("note must be a string.")
    .trim(),
];

export const createApplicationValidator = [
  validateUserId,
  validateCompany,
  validatePosition,
  validateLink,
  validateLocation,
  ...validateProcess,
];

export const getApplicationValidator = [validateId];

export const updateApplicationValidator = [
  validateId,
  validateUserId.optional(),
  validateCompany.optional(),
  validatePosition.optional(),
  validateLocation.optional(),
  validateLink.optional(),
  ...validateProcess,
];

export const deleteApplicationValidator = [validateId];

export const getApplicationsByUserID = [
  validateUserIdParam,
  validateQuery,
  validateStatusQuery,
  validateSortBy,
  validatePage,
  validatePerPage,
];
