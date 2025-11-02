import express from "express";
import multer from "multer";
import * as companyController from "../controllers/companyController";
import * as companyValidator from "../validators/companyValidator";

const companyRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

companyRouter.get(
  "/",
  companyValidator.getCompaniesValidator,
  companyController.getCompanies,
);

companyRouter.get("/all", companyController.getAllCompanies);

companyRouter.post(
  "/",
  upload.single("logo"),
  companyValidator.createCompanyValidator,
  companyController.createCompany,
);

companyRouter.get(
  "/:id",
  companyValidator.getCompanyValidator,
  companyController.getCompanyById,
);

companyRouter.patch(
  "/:id",
  upload.single("logo"),
  companyValidator.updateCompanyValidator,
  companyController.updateCompany,
);

companyRouter.delete(
  "/:id",
  companyValidator.deleteCompanyValidator,
  companyController.deleteCompany,
);

export default companyRouter;
