import { body, param } from "express-validator";

// Default values for page and perPage
// const DEFAULT_PAGE = 0;
// const DEFAULT_PER_PAGE = 10;

const validateId = param("id")
  .isMongoId()
  .withMessage("Invalid tip id. (Must be a Mongo ObjectID.)")
  .trim();

const validateUser = body("user")
  .isString()
  .withMessage("user must be a string.")
  .trim()
  .notEmpty()
  .withMessage("user must be a non-empty string.");

const validateCompany = body("company")
  .isMongoId()
  .withMessage("invalid company id. (Must be a Mongo ObjectID.)")
  .trim();

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

// const validatePage = query("page")
//   .default(DEFAULT_PAGE)
//   .isInt({ min: 0 })
//   .toInt()
//   .withMessage("page must be a non-negative integer");

// const validatePerPage = query("perPage")
//   .default(DEFAULT_PER_PAGE)
//   .isInt({ min: 1 })
//   .toInt()
//   .withMessage("per page must be an integer greater than 1");

export const createTipValidator = [validateUser, validateCompany, validateText];

export const getTipValidator = [validateId];

export const updateTipValidator = [
  validateId,
  validateUser.optional(),
  validateCompany.optional(),
  validateText.optional(),
];

export const deleteTipValidator = [validateId];

export const getTipsByCompanyIdValidator = [validateCompanyId];
