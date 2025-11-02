import { body, param, query } from "express-validator";
import { NumEmployees } from "../models/Company";

// Default values for page and perPage
const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 10;

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

const validateQuery = query("query")
  .optional()
  .isString()
  .withMessage("query must be a string.")
  .trim();

const validateQueryState = query("state")
  .optional()
  .isString()
  .withMessage("state must be a string.")
  .trim();

const validateQueryIndustry = query("industry")
  .optional()
  .isString()
  .withMessage("industry must be a string.")
  .trim();

const validateQueryEmployees = query("employees")
  .optional()
  .isString()
  .withMessage("employees must be a string.")
  .trim();

const validateName = body("name")
  .isString()
  .withMessage("name must be a string.")
  .trim()
  .notEmpty()
  .withMessage("name must be a non-empty string.");

const validateCity = body("city")
  .optional()
  .isString()
  .withMessage("city must be a string.")
  .trim()
  .notEmpty()
  .withMessage("city must be a non-empty string.");

const validateState = body("state")
  .optional()
  .isString()
  .withMessage("state must be a string.")
  .trim()
  .notEmpty()
  .withMessage("state must be a non-empty string.");

const validateLogoKey = body("logoKey")
  .optional()
  .isString()
  .withMessage("logoKey must be a string.")
  .trim()
  .notEmpty()
  .withMessage("logoKey must be a non-empty string.");

const validateEmployees = body("employees")
  .optional()
  .isString()
  .withMessage("employees must be a string.")
  .trim()
  .isIn(Object.values(NumEmployees))
  .withMessage("employees is not a valid employees type.");

const validateIndustry = body("industry")
  .optional()
  .isString()
  .withMessage("industry must be a string.")
  .trim()
  .notEmpty()
  .withMessage("industry must be a non-empty string.");

const validateUrl = body("url")
  .optional()
  .isString()
  .withMessage("url must be a string.")
  .trim()
  .notEmpty()
  .withMessage("url must be a non-empty string.");

const validateId = param("id")
  .isMongoId()
  .withMessage("Invalid company id. (Must be a Mongo ObjectID.)");

export const getCompanyValidator = [validateId];

export const getCompaniesValidator = [
  validatePage,
  validatePerPage,
  validateQuery,
  validateQueryState,
  validateQueryIndustry,
  validateQueryEmployees,
  validateIndustry,
  validateEmployees,
];

export const createCompanyValidator = [
  validateName,
  validateCity,
  validateState,
  validateLogoKey,
  validateEmployees,
  validateIndustry,
  validateUrl,
];

export const updateCompanyValidator = [
  validateId,
  validateName.optional(),
  validateCity,
  validateState,
  validateLogoKey,
  validateEmployees,
  validateIndustry,
  validateUrl,
];

export const deleteCompanyValidator = [validateId];
