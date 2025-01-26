import { body, param } from "express-validator";

const validateId = param("id")
  .isMongoId()
  .withMessage("invalid application id. (Must be a Mongo ObjectID.)")
  .trim();

const validateUserId = body("userId")
  .isString()
  .withMessage("userId must be a string.")
  .trim()
  .notEmpty()
  .withMessage("userId must be a non-empty string.");

const validateCompany = body("company")
  .isMongoId()
  .withMessage("invalid company. (Must be a Mongo ObjectID.)")
  .trim();

const validatePosition = body("position")
  .isString()
  .withMessage("position must be a string.")
  .trim()
  .notEmpty()
  .withMessage("position must be a non-empty string.");

const validateLink = body("link")
  .optional()
  .isURL({
    require_valid_protocol: true,
  })
  .withMessage("link must be a valid URL.")
  .trim();

const validateProcess = [
  body("process")
    .optional()
    .isArray()
    .withMessage("process must be an array of application statuses."),
  body("process.*.status")
    .isIn(["APPLIED", "OA", "PHONE", "FINAL", "OFFER", "REJECTED"])
    .withMessage(
      "Status must be one of: APPLIED, OA, PHONE, FINAL, OFFER, REJECTED",
    ),
  body("process.*.date")
    .notEmpty()
    .withMessage("each application status must have a date.")
    .bail()
    .isISO8601({ strict: true })
    .withMessage("each application status date must be a valid ISO 8601 date."),
  body("process.*.note")
    .optional()
    .isString()
    .withMessage("note must be a string.")
    .trim(),
];

export const createApplicationValidator = [
  validateUserId,
  validateCompany,
  validatePosition,
  validateLink,
  ...validateProcess,
];

export const getApplicationValidator = [validateId];

export const updateApplicationValidator = [
  validateId,
  validateUserId.optional(),
  validateCompany.optional(),
  validatePosition.optional(),
  validateLink.optional(),
  ...validateProcess,
];

export const deleteApplicationValidator = [validateId];
