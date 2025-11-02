import express from "express";
import * as interviewQuestionController from "../controllers/InterviewQuestionController";
import * as interviewQuestionValidator from "../validators/interviewQuestionValidator";
import preprocessCompany from "../middlewares/preprocessCompany";

const interviewQuestionRouter = express.Router();

interviewQuestionRouter.get(
  "/",
  interviewQuestionValidator.getInterviewQuestionsValidator,
  interviewQuestionController.getAllInterviewQuestions,
);

interviewQuestionRouter.post(
  "/",
  preprocessCompany,
  interviewQuestionValidator.createInterviewQuestionValidator,
  interviewQuestionController.createInterviewQuestion,
);

interviewQuestionRouter.get(
  "/:id",
  interviewQuestionValidator.getInterviewQuestionByIdValidator,
  interviewQuestionController.getInterviewQuestionById,
);

interviewQuestionRouter.get(
  "/company/:companyId",
  interviewQuestionValidator.getInterviewQuestionsByCompanyIdValidator,
  interviewQuestionController.getInterviewQuestionsByCompanyId,
);

interviewQuestionRouter.patch(
  "/:id",
  preprocessCompany,
  interviewQuestionValidator.updateInterviewQuestionValidator,
  interviewQuestionController.updateInterviewQuestion,
);

interviewQuestionRouter.delete(
  "/:id",
  interviewQuestionValidator.deleteInterviewQuestionValidator,
  interviewQuestionController.deleteInterviewQuestion,
);

export default interviewQuestionRouter;
