import { body } from "express-validator";

export const generateEmailValidator = [
  body("studentId")
    .exists()
    .withMessage("Student ID is required.")
    .isString()
    .withMessage("Invalid Student ID format."),
  body("alumniId")
    .exists()
    .withMessage("Alumni ID is required.")
    .isString()
    .withMessage("Invalid Alumni ID format."),
  body("tone")
    .optional()
    .isString()
    .isIn(["Professional", "Friendly", "Enthusiastic"])
    .withMessage("Invalid tone."),
  body("purpose")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Purpose must be less than 500 characters."),
];
