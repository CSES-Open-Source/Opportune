import express from "express";
import * as savedApplicationController from "src/controllers/savedApplicationController";
const savedApplicationRouter = express.Router();

savedApplicationRouter.get(
  "/",
  savedApplicationController.getAllSavedApplications,
);

savedApplicationRouter.post(
  "/",
  savedApplicationController.createSavedApplication,
);

savedApplicationRouter.get(
  "/:id",
  savedApplicationController.getSavedApplicationByID,
);

savedApplicationRouter.patch(
  "/:id",
  savedApplicationController.updateSavedApplicationByID,
);

savedApplicationRouter.delete(
  "/:id",
  savedApplicationController.deleteSavedApplicationByID,
);

savedApplicationRouter.get(
  "/user/:id",
  savedApplicationController.getSavedApplicationsByUserID,
);

export default savedApplicationRouter;
