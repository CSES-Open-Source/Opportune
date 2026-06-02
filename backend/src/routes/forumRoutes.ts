import { Router } from "express";
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  createReply,
  reactToAnswer,
} from "../controllers/forumController";

const router = Router();

router.get("/questions", getQuestions);
router.get("/questions/:questionId", getQuestion);
router.post("/questions", createQuestion);
router.patch("/questions/:questionId", updateQuestion);
router.delete("/questions/:questionId", deleteQuestion);

router.post("/questions/:questionId/answers", createAnswer);
router.patch("/answers/:answerId", updateAnswer);
router.delete("/answers/:answerId", deleteAnswer);
router.post("/answers/:answerId/replies", createReply);
router.patch("/answers/:answerId/reactions", reactToAnswer);

export default router;
