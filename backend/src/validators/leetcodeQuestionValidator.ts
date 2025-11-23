import { body, param, query } from "express-validator";
import { Difficulty } from "../models/LeetcodeQuestion";

// Default values for page and perPage
const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 10;

const validateIdParam = param("id")
  .isMongoId()
  .withMessage("invalid leetcode question id. (Must be a Mongo ObjectID.)")
  .trim();

const validateCompany = body("company")
  .isMongoId()
  .withMessage("invalid company id. (Must be a Mongo ObjectID.)")
  .trim();

const validateCompanyIdParam = param("companyId")
  .isMongoId()
  .withMessage("invalid company id. (Must be a Mongo ObjectID.)")
  .trim();

const validateUserId = body("userId")
  .isString()
  .withMessage("invalid userId. (Must be a string)")
  .trim()
  .notEmpty()
  .withMessage("userId must be a non-empty string.");

const validateTitle = body("title")
  .isString()
  .withMessage("title must be a string.")
  .notEmpty()
  .withMessage("title is required.");

const validateURL = body("url")
  .isURL({
    require_valid_protocol: true,
  })
  .withMessage("must be a valid URL.")
  .trim();

const validateDifficulty = body("difficulty").custom((value) => {
  const difficulties = Array.isArray(value) ? value : [value];
  const validDifficulties = Object.values(Difficulty);
  for (const s of difficulties) {
    if (!validDifficulties.includes(s)) {
      throw new Error(`Difficulty must be one of:
            ${validDifficulties.join(", ")}`);
    }
  }
  return true;
});

const validateDate = body("date")
  .optional()
  .isISO8601({ strict: true })
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
  .isIn(["date", "difficulty"])
  .withMessage("Sort by must be one of: date, difficulty");

const validateDifficultyQuery = query("difficulty").custom((value) => {
  if (!value) {
    return true;
  }
  const difficulties = Array.isArray(value) ? value : [value];
  const validDifficulties = Object.values(Difficulty);
  for (const s of difficulties) {
    if (!validDifficulties.includes(s)) {
      throw new Error(
        `Difficulty must be one of: ${validDifficulties.join(", ")}`,
      );
    }
  }
  return true;
});

export const getLeetcodeQuestionsValidator = [
  validatePage,
  validatePerPage,
  validateQuery,
  validateSortBy,
  validateDifficultyQuery,
];

export const createLeetcodeQuestionValidator = [
  validateCompany,
  validateUserId,
  validateTitle,
  validateURL,
  validateDifficulty,
  validateDate,
];

export const getLeetcodeQuestionByIdValidator = [validateIdParam];

export const updateLeetcodeQuestionValidator = [
  validateIdParam,
  validateUserId.optional(),
  validateCompany.optional(),
  validateTitle.optional(),
  validateURL.optional(),
  validateDifficulty.optional(),
  validateDate.optional(),
];

export const deleteLeetcodeQuestionValidator = [validateIdParam];

export const getLeetcodeQuestionByCompanyValidator = [validateCompanyIdParam];
