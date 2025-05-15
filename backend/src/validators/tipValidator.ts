import { body, param, query } from "express-validator";

// Default values for page and perPage
const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 10;

const validateId = param("id")
  .isMongoId()
  .withMessage("Invalid tip id. (Must be a Mongo ObjectID.)")
  .trim();

const validateUserId = body("userId")
  .isString()
  .withMessage("userId must be a string.")
  .trim()
  .notEmpty()
  .withMessage("userId must be a non-empty string.");

const validateText = body("text")
  .isString()
  .withMessage("Text must be a string.")
  .trim()
  .notEmpty()
  .withMessage("Text must be a non-empty string.");

const validateCompanyId = param("id")
  .isMongoId()
  .withMessage("Invalid company id. (Must be a Mongo ObjectID.)")
  .trim();

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

export const createTipValidator = [validateUserId, validateText];

export const getTipValidator = [validateId];

export const updateTipValidator = [
  validateId,
  validateUserId.optional(),
  validateText.optional(),
];

export const deleteTipValidator = [validateId];

export const getTipsByCompanyIdValidator = [
  validateCompanyId,
  validatePage,
  validatePerPage,
];
