import express from "express";
import * as applicationController from "../controllers/applicationController";
import preprocessCompany from "../middlewares/preprocessCompany";
import * as applicationValidator from "../validators/applicationValidator";
const applicationRouter = express.Router();

applicationRouter.get("/", applicationController.getAllApplications);

applicationRouter.post(
  "/",
  preprocessCompany,
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
  preprocessCompany,
  applicationValidator.updateApplicationValidator,
  applicationController.updateApplicationByID,
);

applicationRouter.delete(
  "/:id",
  applicationValidator.deleteApplicationValidator,
  applicationController.deleteApplicationByID,
);

applicationRouter.get(
  "/user/:userId",
  applicationValidator.getApplicationsByUserID,
  applicationController.getApplicationsByUserID,
);

export default applicationRouter;
