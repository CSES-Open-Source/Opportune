import { body } from "express-validator";

const validateIdBody = body("userId")
  .isString()
  .withMessage("userId must be a string.")
  .trim()
  .isLength({ min: 1 })
  .withMessage("userId is required.");

const validateOrganization = body("organizations")
  .isArray({ min: 1 })
  .withMessage("fieldOfInterest must be an array.")
  .trim()
  .notEmpty()
  .withMessage("fieldOfInterest is required.");

const validatePreviousEmployers = body("previousEmployers")
  .isArray({ min: 1 })
  .withMessage("fieldOfInterest must be an array.")
  .trim()
  .notEmpty()
  .withMessage("fieldOfInterest is required.");

const validateSpecializations = body("specializations")
  .isArray({ min: 1 })
  .withMessage("fieldOfInterest must be an array.")
  .trim()
  .notEmpty()
  .withMessage("fieldOfInterest is required.");

const validateHobbies = body("hobbies")
  .isArray({ min: 1 })
  .withMessage("fieldOfInterest must be an array.")
  .trim()
  .notEmpty()
  .withMessage("fieldOfInterest is required.");

const validateSkills = body("skills")
  .isArray({ min: 1 })
  .withMessage("fieldOfInterest must be an array.")
  .trim()
  .notEmpty()
  .withMessage("fieldOfInterest is required.");

export const createAlumniValidator = [
  validateIdBody,
  validateOrganization,
  validatePreviousEmployers,
  validateSkills,
  validateSpecializations,
  validateHobbies,
];
