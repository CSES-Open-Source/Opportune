import { body } from "express-validator";

const validateIdBody = body("userId")
  .isString()
  .withMessage("userId must be a string.")
  .trim()
  .isLength({ min: 1 })
  .withMessage("userId is required.");

const validateSchool = body("school")
  .isString()
  .withMessage("school must be a string.")
  .trim()
  .isLength({ min: 1 })
  .withMessage("school is required.");

const validateFieldOfInterest = body("fieldOfInterest")
  .isArray({ min: 1 })
  .withMessage("fieldOfInterest must be an array.")
  .trim()
  .notEmpty()
  .withMessage("fieldOfInterest is required.");

const validateProjects = body("projects")
  .isArray({ min: 1 })
  .withMessage("projects must be an array.")
  .trim()
  .notEmpty()
  .withMessage("projects is required.");

const validateHobbies = body("hobbies")
  .isArray({ min: 1 })
  .withMessage("hobbies must be an array.")
  .trim()
  .notEmpty()
  .withMessage("hobbies is required.");

const validateSkills = body("skills")
  .isArray({ min: 1 })
  .withMessage("skills must be an array.")
  .trim()
  .notEmpty()
  .withMessage("skills is required.");

const validateCompaniesOfInterest = body("companiesOfInterest")
  .isArray({ min: 1 })
  .withMessage("companiesOfInterest must be an array.")
  .trim()
  .notEmpty()
  .withMessage("companiesOfInterest is required.");

export const createStudentValidator = [
  validateIdBody,
  validateSchool,
  validateFieldOfInterest,
  validateProjects,
  validateHobbies,
  validateSkills,
  validateCompaniesOfInterest,
];
