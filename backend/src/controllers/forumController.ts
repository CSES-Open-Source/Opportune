import { RequestHandler } from "express";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import Question from "../models/Questions";
import Answer, { VALID_REACTIONS } from "../models/Answers";

export const getQuestions: RequestHandler = async (req, res, next) => {
  try {
    const questions = await Question.find().sort({ createdDate: -1 });
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

export const getQuestion: RequestHandler = async (req, res, next) => {
  const { questionId } = req.params;
  try {
    if (!mongoose.isValidObjectId(questionId)) {
      throw createHttpError(400, "Invalid question ID.");
    }

    const question = await Question.findById(questionId).populate({
      path: "answers",
      populate: { path: "replies" },
    });
    if (!question) {
      throw createHttpError(404, "Question not found.");
    }

    res.status(200).json(question);
  } catch (error) {
    next(error);
  }
};

export const createQuestion: RequestHandler = async (req, res, next) => {
  const { questionTitle, questionContent, userId } = req.body;
  try {
    if (!questionTitle || !questionContent || !userId) {
      throw createHttpError(400, "questionTitle, questionContent, and userId are required.");
    }

    const question = await Question.create({ questionTitle, questionContent, userId });
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

export const updateQuestion: RequestHandler = async (req, res, next) => {
  const { questionId } = req.params;
  const { questionTitle, questionContent } = req.body;
  try {
    if (!mongoose.isValidObjectId(questionId)) {
      throw createHttpError(400, "Invalid question ID.");
    }

    const question = await Question.findByIdAndUpdate(
      questionId,
      { questionTitle, questionContent },
      { new: true, runValidators: true },
    );
    if (!question) {
      throw createHttpError(404, "Question not found.");
    }

    res.status(200).json(question);
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion: RequestHandler = async (req, res, next) => {
  const { questionId } = req.params;
  try {
    if (!mongoose.isValidObjectId(questionId)) {
      throw createHttpError(400, "Invalid question ID.");
    }

    const question = await Question.findById(questionId);
    if (!question) {
      throw createHttpError(404, "Question not found.");
    }

    await Answer.deleteMany({ _id: { $in: question.answers } });
    await question.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const createAnswer: RequestHandler = async (req, res, next) => {
  const { questionId } = req.params;
  const { userId, answerContent } = req.body;
  try {
    if (!mongoose.isValidObjectId(questionId)) {
      throw createHttpError(400, "Invalid question ID.");
    }
    if (!userId || !answerContent) {
      throw createHttpError(400, "userId and answerContent are required.");
    }

    const question = await Question.findById(questionId);
    if (!question) {
      throw createHttpError(404, "Question not found.");
    }

    const answer = await Answer.create({ userId, answerContent });
    question.answers.push(answer._id);
    await question.save();

    res.status(201).json(answer);
  } catch (error) {
    next(error);
  }
};

export const updateAnswer: RequestHandler = async (req, res, next) => {
  const { answerId } = req.params;
  const { answerContent } = req.body;
  try {
    if (!mongoose.isValidObjectId(answerId)) {
      throw createHttpError(400, "Invalid answer ID.");
    }

    const answer = await Answer.findByIdAndUpdate(
      answerId,
      { answerContent },
      { new: true, runValidators: true },
    );
    if (!answer) {
      throw createHttpError(404, "Answer not found.");
    }

    res.status(200).json(answer);
  } catch (error) {
    next(error);
  }
};

export const deleteAnswer: RequestHandler = async (req, res, next) => {
  const { answerId } = req.params;
  try {
    if (!mongoose.isValidObjectId(answerId)) {
      throw createHttpError(400, "Invalid answer ID.");
    }

    const answer = await Answer.findByIdAndDelete(answerId);
    if (!answer) {
      throw createHttpError(404, "Answer not found.");
    }

    // Remove from parent question
    await Question.updateOne(
      { answers: answerId },
      { $pull: { answers: new mongoose.Types.ObjectId(answerId) } },
    );

    // Also remove if it was a reply on another answer
    await Answer.updateOne(
      { replies: answerId },
      { $pull: { replies: new mongoose.Types.ObjectId(answerId) } },
    );

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// POST /api/forum/answers/:answerId/replies
export const createReply: RequestHandler = async (req, res, next) => {
  const { answerId } = req.params;
  const { userId, answerContent } = req.body;
  try {
    if (!mongoose.isValidObjectId(answerId)) {
      throw createHttpError(400, "Invalid answer ID.");
    }
    if (!userId || !answerContent) {
      throw createHttpError(400, "userId and answerContent are required.");
    }

    const parentAnswer = await Answer.findById(answerId);
    if (!parentAnswer) {
      throw createHttpError(404, "Answer not found.");
    }

    const reply = await Answer.create({ userId, answerContent });
    parentAnswer.replies.push(reply._id);
    await parentAnswer.save();

    res.status(201).json(reply);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/forum/answers/:answerId/reactions
export const reactToAnswer: RequestHandler = async (req, res, next) => {
  const { answerId } = req.params;
  const { userId, emoji } = req.body;
  try {
    if (!mongoose.isValidObjectId(answerId)) {
      throw createHttpError(400, "Invalid answer ID.");
    }
    if (!userId) {
      throw createHttpError(400, "userId is required.");
    }
    if (!VALID_REACTIONS.includes(emoji)) {
      throw createHttpError(400, `Invalid emoji. Must be one of: ${VALID_REACTIONS.join(" ")}`);
    }

    const answer = await Answer.findById(answerId);
    if (!answer) {
      throw createHttpError(404, "Answer not found.");
    }

    const reactions = answer.reactions as Array<{ userId: string; emoji: string }>;
    const existingIndex = reactions.findIndex(
      (r) => r.userId === userId && r.emoji === emoji,
    );

    if (existingIndex !== -1) {
      // User already reacted with this emoji — toggle it off
      reactions.splice(existingIndex, 1);
    } else {
      // Add the reaction
      reactions.push({ userId, emoji });
    }

    await answer.save();
    res.status(200).json(answer);
  } catch (error) {
    next(error);
  }
};