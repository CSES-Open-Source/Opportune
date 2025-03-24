import { body, param, query } from "express-validator";
import { UserType } from "src/models/User";

// Default values for page and perPage
const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 10;

const validateIdBody = body("_id")
  .isString()
  .withMessage("_id must be a string.")
  .trim()
  .isLength({ min: 1 })
  .withMessage("_id is required.");

const validateIdParam = param("id")
  .isString()
  .withMessage("id must be a string.")
  .trim();

const validateEmail = body("email")
  .isString()
  .withMessage("email must be a string.")
  .trim()
  .isEmail()
  .withMessage("email must be a valid email address.")
  .notEmpty()
  .withMessage("email is required.");

const validateName = body("name")
  .isString()
  .withMessage("name must be a string.")
  .trim()
  .isLength({ min: 1 })
  .withMessage("name must be at least 1 characters.")
  .notEmpty()
  .withMessage("name is required.");

const validateProfilePicture = body("profilePicture")
  .isString()
  .withMessage("profilePicture must be a string.")
  .trim()
  .isURL({ require_valid_protocol: true })
  .withMessage("profilePicture must be a valid URL.");

const validateType = body("type")
  .isString()
  .withMessage("type of account must be a string.")
  .trim()
  .isIn(Object.values(UserType))
  .withMessage("type is not a valid user type.");

const validateLinkedIn = body("linkedIn")
  .optional()
  .isString()
  .withMessage("linkedIn must be a string.")
  .trim()
  .isURL({ require_valid_protocol: true })
  .withMessage("linkedIn must be a valid URL.");

// TODO: likely needs better parsing for international numbers (currently set to string to allow frontend format to pass)
const validatePhoneNumber = body("phoneNumber")
  .optional()
  .isString()
  .withMessage("phoneNumber must be a valid phone number.");

// Only for students
const validateMajor = body("major")
  .optional()
  .isString()
  .withMessage("major must be a string.")
  .trim()
  .isLength({ min: 2 })
  .withMessage("major must be at least 2 characters.");

// Only for students
const validateClassLevel = body("classLevel")
  .optional()
  .isString()
  .withMessage("classLevel must be a string.")
  .trim()
  .isLength({ min: 2 })
  .withMessage("classLevel must be at least 2 characters.");

// Only for alumni
const validateCompany = body("company")
  .optional()
  .isMongoId()
  .withMessage("invalid company. (Must be a Mongo ObjectID.)")
  .trim();

// Only for alumni
const validateShareProfile = body("shareProfile")
  .optional()
  .isBoolean()
  .withMessage("shareProfile must be a boolean.");

// only for alumni
const validatePosition = body("position")
  .optional()
  .isString()
  .withMessage("position must be a string.")
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

const validateQuery = query("query")
  .optional()
  .isString()
  .withMessage("query must be a string.")
  .trim();

const validateCompanyName = query("company")
  .optional()
  .isString()
  .withMessage("company (name) must be a string.")
  .trim();

const validatePositionQuery = query("position")
  .optional()
  .isString()
  .withMessage("position must be a string.")
  .trim();

const validateIndustry = query("industry")
  .optional()
  .isString()
  .withMessage("industry must be a string.")
  .trim();

export const createUserValidator = [
  validateIdBody,
  validateEmail,
  validateName,
  validateProfilePicture,
  validateType,
  validateLinkedIn,
  validatePhoneNumber,
  validateMajor,
  validateClassLevel,
  validateCompany,
  validateShareProfile,
  validatePosition,
];

export const getUservalidator = [validateIdParam];

export const updateUserValidator = [
  validateIdParam,
  validateName.optional(),
  validateEmail.optional(),
  validateProfilePicture.optional(),
  validateType.optional(),
  validateLinkedIn,
  validatePhoneNumber,
  validateMajor,
  validateClassLevel,
  validateCompany,
  validateShareProfile,
  validatePosition,
];

export const deleteUserValidator = [validateIdParam];

export const getOpenAlumniValidator = [
  validatePage,
  validatePerPage,
  validateQuery,
  validateCompanyName,
  validatePositionQuery,
  validateIndustry,
];
