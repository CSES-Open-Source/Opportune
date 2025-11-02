import express from "express";
import * as savedApplicationController from "../controllers/savedApplicationController";
import preprocessCompany from "../middlewares/preprocessCompany";
import * as savedApplicationValidator from "../validators/savedApplicationValidator";
const savedApplicationRouter = express.Router();

savedApplicationRouter.get(
  "/",
  savedApplicationController.getAllSavedApplications,
);

savedApplicationRouter.post(
  "/",
  preprocessCompany,
  savedApplicationValidator.createSavedApplicationValidator,
  savedApplicationController.createSavedApplication,
);

savedApplicationRouter.get(
  "/:id",
  savedApplicationValidator.getSavedApplicationValidator,
  savedApplicationController.getSavedApplicationByID,
);

savedApplicationRouter.patch(
  "/:id",
  preprocessCompany,
  savedApplicationValidator.updateSavedApplicationValidator,
  savedApplicationController.updateSavedApplicationByID,
);

savedApplicationRouter.delete(
  "/:id",
  savedApplicationValidator.deleteSavedApplicationValidator,
  savedApplicationController.deleteSavedApplicationByID,
);

savedApplicationRouter.get(
  "/user/:id",
  savedApplicationValidator.getSavedApplicationByIDValidator,
  savedApplicationController.getSavedApplicationsByUserID,
);

export default savedApplicationRouter;
