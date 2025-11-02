import express from "express";
import * as tipController from "../controllers/tipController";
import preprocessCompany from "../middlewares/preprocessCompany";
import * as tipValidator from "../validators/tipValidator";
const tipRouter = express.Router();

// Get all tips (mainly for testing)
tipRouter.get("/", tipController.getAllTips);

// Create new tip
tipRouter.post(
  "/",
  preprocessCompany,
  tipValidator.createTipValidator,
  tipController.createTip,
);

// Get tip by ID
tipRouter.get("/:id", tipValidator.getTipValidator, tipController.getTipById);

// Update tip by ID
tipRouter.patch(
  "/:id",
  preprocessCompany,
  tipValidator.updateTipValidator,
  tipController.updateTipById,
);

// Delete tip by ID
tipRouter.delete(
  "/:id",
  tipValidator.deleteTipValidator,
  tipController.deleteTipById,
);

// Get tips by company ID
tipRouter.get(
  "/company/:id",
  tipValidator.getTipsByCompanyIdValidator,
  tipController.getTipsByCompanyId,
);

export default tipRouter;
