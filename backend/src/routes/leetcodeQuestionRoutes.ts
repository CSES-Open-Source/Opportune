import express from "express";
import * as leetcodeQuestionController from "../controllers/leetcodeQuestionController";
import * as leetcodeQuestionValidator from "../validators/leetcodeQuestionValidator";
import preprocessCompany from "../middlewares/preprocessCompany";

const leetcodeQuestionRouter = express.Router();

leetcodeQuestionRouter.get(
  "/",
  leetcodeQuestionValidator.getLeetcodeQuestionsValidator,
  leetcodeQuestionController.getLeetcodeQuestions,
);

leetcodeQuestionRouter.post(
  "/",
  preprocessCompany,
  leetcodeQuestionValidator.createLeetcodeQuestionValidator,
  leetcodeQuestionController.createLeetcodeQuestion,
);

leetcodeQuestionRouter.get(
  "/:id",
  leetcodeQuestionValidator.getLeetcodeQuestionByIdValidator,
  leetcodeQuestionController.getLeetcodeQuestionById,
);

leetcodeQuestionRouter.patch(
  "/:id",
  preprocessCompany,
  leetcodeQuestionValidator.updateLeetcodeQuestionValidator,
  leetcodeQuestionController.updateLeetcodeQuestion,
);

leetcodeQuestionRouter.delete(
  "/:id",
  leetcodeQuestionValidator.deleteLeetcodeQuestionValidator,
  leetcodeQuestionController.deleteLeetcodeQuestion,
);

leetcodeQuestionRouter.get(
  "/company/:companyId",
  leetcodeQuestionValidator.getLeetcodeQuestionByCompanyValidator,
  leetcodeQuestionController.getLeetcodeQuestionByCompanyId,
);

export default leetcodeQuestionRouter;
