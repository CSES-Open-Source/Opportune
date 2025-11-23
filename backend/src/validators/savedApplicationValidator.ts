import { body, param, query } from "express-validator";

// Default values for page and perPage
const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 10;

const validateParamId = param("id")
  .isString()
  .withMessage("id must be a string.")
  .trim();

const validateUserId = body("userId")
  .isString()
  .withMessage("userId must be a string.")
  .trim()
  .notEmpty()
  .withMessage("userId must be a non-empty string.");

const validateCompany = body("company")
  .isMongoId()
  .withMessage("invalid company id. (Must be a Mongo ObjectID.)")
  .trim();

const validateCompanyName = body("companyName")
  .isString()
  .withMessage("companyName must be a string.")
  .trim()
  .notEmpty()
  .withMessage("companyName must be a non-empty string.");

const validateLocation = body("location")
  .optional()
  .isString()
  .withMessage("location must be a string.")
  .trim()
  .notEmpty()
  .withMessage("location must be a non-empty string.");

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

const validateMaterialsNeeded = body("materialsNeeded")
  .default([])
  .isArray()
  .withMessage("materialsNeeded must be a valid array.");

const validateDeadline = body("deadline")
  .optional()
  .isISO8601()
  .withMessage("deadline must be a valid ISO 8601 date.");

const validateQuery = query("query")
  .optional()
  .isString()
  .withMessage("query must be a string.")
  .trim();

const validateSortBy = query("sortBy")
  .optional()
  .isString()
  .withMessage("sortBy must be a string.")
  .trim();

const validatePage = query("page")
  .default(DEFAULT_PAGE)
  .isInt({ min: 0 })
  .toInt()
  .withMessage("page must be an integer > -1.");

const validatePerPage = query("perPage")
  .default(DEFAULT_PER_PAGE)
  .isInt({ min: 1 })
  .toInt()
  .withMessage("perPage must be an integer > 0.");

export const createSavedApplicationValidator = [
  validateUserId,
  validateCompany,
  validateCompanyName,
  validatePosition,
  validateLocation,
  validateLink,
  validateMaterialsNeeded,
  validateDeadline,
];

export const getSavedApplicationValidator = [validateParamId];

export const updateSavedApplicationValidator = [
  validateParamId,
  validateCompany.optional(),
  validateCompanyName.optional(),
  validatePosition.optional(),
  validateLink.optional(),
  validateLocation.optional(),
  validateMaterialsNeeded.optional(),
  validateDeadline.optional(),
];

export const deleteSavedApplicationValidator = [validateParamId];

export const getSavedApplicationByIDValidator = [
  validateParamId,
  validateQuery,
  validateSortBy,
  validatePage,
  validatePerPage,
];
