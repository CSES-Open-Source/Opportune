import express from "express";
import * as savedApplicationController from "src/controllers/savedApplicationController";
import * as savedApplicationValidator from "src/validators/savedApplicationValidator";
const savedApplicationRouter = express.Router();

savedApplicationRouter.get(
  "/",
  savedApplicationController.getAllSavedApplications,
);

savedApplicationRouter.post(
  "/",
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
