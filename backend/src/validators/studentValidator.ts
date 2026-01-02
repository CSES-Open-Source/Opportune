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
  .optional()
  .isArray()
  .withMessage("fieldOfInterest must be an array.")
  .custom((value) => {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item !== "string") {
          throw new Error("Each item in fieldOfInterest must be a string.");
        }
      }
    }
    return true;
  });

const validateProjects = body("projects")
  .optional()
  .isArray()
  .withMessage("Projects must be an array.")
  .custom((value) => {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item !== "string") {
          throw new Error("Each item in projects must be a string.");
        }
      }
    }
    return true;
  });

const validateHobbies = body("hobbies")
  .optional()
  .isArray()
  .withMessage("Hobbies must be an array.")
  .custom((value) => {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item !== "string") {
          throw new Error("Each item in hobbies must be a string.");
        }
      }
    }
    return true;
  });

const validateSkills = body("skills")
  .optional()
  .isArray()
  .withMessage("Skills must be an array.")
  .custom((value) => {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item !== "string") {
          throw new Error("Each item in skills must be a string.");
        }
      }
    }
    return true;
  });

const validateCompaniesOfInterest = body("companiesOfInterest")
  .optional()
  .isArray()
  .withMessage("Companies of Interest must be an array.")
  .custom((value) => {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item !== "string") {
          throw new Error("Each item in companiesOfInterest must be a string.");
        }
      }
    }
    return true;
  });

export const createStudentValidator = [
  validateIdBody,
  validateSchool,
  validateFieldOfInterest,
  validateProjects,
  validateHobbies,
  validateSkills,
  validateCompaniesOfInterest,
];

export const updateStudentValidator = [
  validateSchool.optional(),
  validateFieldOfInterest.optional(),
  validateProjects.optional(),
  validateHobbies.optional(),
  validateSkills.optional(),
  validateCompaniesOfInterest.optional(),
];
