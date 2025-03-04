import express from "express";
import * as leetcodeQuestionController from "src/controllers/leetcodeQuestionController";

const leetcodeQuestionRouter = express.Router();

leetcodeQuestionRouter.get(
  "/",
  leetcodeQuestionController.getLeetcodeQuestions,
);

leetcodeQuestionRouter.post(
  "/",
  leetcodeQuestionController.createLeetcodeQuestion,
);

leetcodeQuestionRouter.get(
  "/:id",
  leetcodeQuestionController.getLeetcodeQuestionById,
);

leetcodeQuestionRouter.patch(
  "/:id",
  leetcodeQuestionController.updateLeetcodeQuestion,
);

leetcodeQuestionRouter.delete(
  "/:id",
  leetcodeQuestionController.deleteLeetcodeQuestion,
);

leetcodeQuestionRouter.get(
  "/company/:companyId",
  leetcodeQuestionController.getLeetcodeQuestionByCompanyId,
);

export default leetcodeQuestionRouter;
