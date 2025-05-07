import { body, param, query } from "express-validator";

// Default values for page and perPage
const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 10;

const validateIdParam = param("id")
  .isMongoId()
  .withMessage("invalid application id. (Must be a Mongo ObjectID.)")
  .trim();

const validateCompany = body("company")
  .isMongoId()
  .withMessage("invalid company id. (Must be a Mongo ObjectID.)")
  .trim();

const validateQuestion = body("question")
  .isString()
  .withMessage("question must be a string.")
  .notEmpty()
  .withMessage("question is required.");

const validateDate = body("date")
  .isDate()
  .withMessage("must be a valid date.")
  .trim();

const validatePage = query("page")
  .default(DEFAULT_PAGE)
  .isInt({ min: 0 })
  .toInt()
  .withMessage("page must be an integer >= 0.");

const validatePerPage = query("perPage")
  .default(DEFAULT_PER_PAGE)
  .isInt({ min: 1 })
  .toInt()
  .withMessage("perPage must be an integer >= 1.");

const validateQuery = query("query")
  .optional()
  .isString()
  .withMessage("query must be a string.")
  .trim();

const validateSortBy = query("sortBy")
  .optional()
  .isIn(["createdAt", "updatedAt", "process"])
  .withMessage("Sort by must be one of: createdAt, updatedAt, process");

export const getInterviewQuestionsValidator = [
  validatePage,
  validatePerPage,
  validateQuery,
  validateSortBy,
];

export const createInterviewQuestionValidator = [
  validateCompany,
  validateQuestion,
  validateDate,
];

export const getInterviewQuestionByIdValidator = [validateIdParam];

export const updateInterviewQuestionValidator = [
  validateIdParam,
  validateQuestion.optional(),
  validateDate.optional(),
];

export const deleteInterviewQuestionValidator = [validateIdParam];

export const getInterviewQuestionsByCompanyIdValidator = [
  validateCompany,
  validatePage,
  validatePerPage,
];
