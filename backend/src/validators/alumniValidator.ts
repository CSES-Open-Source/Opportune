import { body } from "express-validator";

const validateIdBody = body("userId")
  .isString()
  .withMessage("userId must be a string.")
  .trim()
  .isLength({ min: 1 })
  .withMessage("userId is required.");

const validateOrganization = body("organizations")
  .optional()
  .isArray()
  .withMessage("Organizations must be an array.")
  .custom((value) => {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item !== "string") {
          throw new Error("Each item in organizations must be a string.");
        }
      }
    }
    return true;
  });

const validateSpecializations = body("specializations")
  .optional()
  .isArray()
  .withMessage("Specializations must be an array.")
  .custom((value) => {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item !== "string") {
          throw new Error("Each item in specializations must be a string.");
        }
      }
    }
    return true;
  });

export const createAlumniValidator = [
  validateIdBody,
  validateOrganization,
  validateSpecializations,
];

export const updateAlumniValidator = [
  validateIdBody.optional(),
  validateOrganization.optional(),
  validateSpecializations.optional(),
];
