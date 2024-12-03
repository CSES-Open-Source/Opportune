import express from "express";
import * as applicationController from "src/controllers/applicationController";
import * as applicationValidator from "src/validators/applicationValidator";
const applicationRouter = express.Router();

applicationRouter.get("/", applicationController.getAllApplications);

applicationRouter.post(
  "/",
  applicationValidator.createApplicationValidator,
  applicationController.createApplication,
);

applicationRouter.get(
  "/:id",
  applicationValidator.getApplicationValidator,
  applicationController.getApplicationByID,
);

applicationRouter.patch(
  "/:id",
  applicationValidator.updateApplicationValidator,
  applicationController.updateApplicationByID,
);

applicationRouter.delete(
  "/:id",
  applicationValidator.deleteApplicationValidator,
  applicationController.deleteApplicationByID,
);

applicationRouter.get(
  "/user/:id",
  applicationValidator.getApplicationsByUserID,
  applicationController.getApplicationsByUserID,
);

export default applicationRouter;
