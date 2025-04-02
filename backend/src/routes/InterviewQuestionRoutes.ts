import express from "express";
import * as interviewQuestionController from "src/controllers/interviewquestionController";
const interviewQuestionRouter = express.Router();

interviewQuestionRouter.get(
  "/",
  interviewQuestionController.getAllInterviewQuestions,
);

interviewQuestionRouter.post(
  "/",
  interviewQuestionController.createInterviewQuestion,
);

interviewQuestionRouter.get(
  "/:id",
  interviewQuestionController.getInterviewQuestionById,
);

interviewQuestionRouter.get(
  "/company/:companyId",
  interviewQuestionController.getInterviewQuestionsByCompanyId,
);

interviewQuestionRouter.patch(
  "/:id",
  interviewQuestionController.updateInterviewQuestion,
);

interviewQuestionRouter.delete(
  "/:id",
  interviewQuestionController.deleteInterviewQuestion,
);

export default interviewQuestionRouter;
