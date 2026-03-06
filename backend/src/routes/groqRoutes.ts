import express from "express";
import * as GroqController from "../controllers/groqController";
import { generateEmailValidator } from "../validators/groqValidator";

const router = express.Router();

router.post(
  "/generate-email",
  generateEmailValidator,
  GroqController.generateEmail,
);

export default router;
