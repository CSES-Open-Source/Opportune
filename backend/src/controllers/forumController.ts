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

    const question = await Question.findById(questionId).populate("answers");
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
      throw createHttpError(
        400,
        "questionTitle, questionContent, and userId are required.",
      );
    }

    const question = await Question.create({
      questionTitle,
      questionContent,
      userId,
    });
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

    await Question.updateOne(
      { answers: answerId },
      { $pull: { answers: new mongoose.Types.ObjectId(answerId) } },
    );

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const reactToAnswer: RequestHandler = async (req, res, next) => {
  const { answerId } = req.params;
  const { emoji, delta } = req.body;
  try {
    if (!mongoose.isValidObjectId(answerId)) {
      throw createHttpError(400, "Invalid answer ID.");
    }
    if (!VALID_REACTIONS.includes(emoji)) {
      throw createHttpError(
        400,
        `Invalid emoji. Must be one of: ${VALID_REACTIONS.join(" ")}`,
      );
    }
    if (delta !== 1 && delta !== -1) {
      throw createHttpError(400, "delta must be 1 or -1.");
    }

    const answer = await Answer.findById(answerId);
    if (!answer) {
      throw createHttpError(404, "Answer not found.");
    }

    const current = (answer.reactions as Map<string, number>).get(emoji) ?? 0;
    const updated = Math.max(0, current + delta);
    (answer.reactions as Map<string, number>).set(emoji, updated);
    await answer.save();

    res.status(200).json(answer);
  } catch (error) {
    next(error);
  }
};
