import { body, param, query } from "express-validator";

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

const validateUserId = body("userId")
  .isString()
  .withMessage("userId must be a string.")
  .trim()
  .notEmpty()
  .withMessage("userId is required.");

const validateTitle = body("title")
  .isString()
  .withMessage("title must be a string.")
  .trim()
  .notEmpty()
  .withMessage("title is required.");

const validateContent = body("content")
  .isString()
  .withMessage("content must be a string.")
  .trim()
  .notEmpty()
  .withMessage("content is required.");

const validateIdParam = param("id")
  .isString()
  .withMessage("id must be a string.")
  .trim();

export const getArticlesValidator = [
  validatePage,
  validatePerPage,
  validateQuery,
];

export const createArticleValidator = [
  validateUserId,
  validateTitle,
  validateContent,
];

export const getArticleValidator = [validateIdParam];

export const updateArticleValidator = [
  validateIdParam,
  validateUserId.optional(),
  validateTitle.optional(),
  validateContent.optional(),
];

export const deleteArticleValidator = [validateIdParam];
