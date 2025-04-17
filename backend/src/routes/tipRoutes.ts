import express from "express";
import * as tipController from "src/controllers/tipController";
import * as tipValidator from "src/validators/tipValidator";
const tipRouter = express.Router();

// Get all tips (mainly for testing)
tipRouter.get("/", tipController.getAllTips);

// Create new tip
tipRouter.post(
  "/",
  tipValidator.createTipValidator,
  tipController.createTip
);

// Get tip by ID
tipRouter.get(
  "/:id",
  tipValidator.getTipValidator,
  tipController.getTipById
);

// Update tip by ID
tipRouter.patch(
  "/:id",
  tipValidator.updateTipValidator,
  tipController.updateTipById
);

// Delete tip by ID
tipRouter.delete(
  "/:id",
  tipValidator.deleteTipValidator,
  tipController.deleteTipById
);

// Get tips by company ID
tipRouter.get(
  "/company/:id",
  tipValidator.getTipsByCompanyIdValidator,
  tipController.getTipsByCompanyId
);

export default tipRouter;