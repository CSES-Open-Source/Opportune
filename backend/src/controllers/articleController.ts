import Article from "../models/Article";
import { matchedData, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import validationErrorParser from "../util/validationErrorParser";

// @desc Get all articles
// @route GET /api/articles
// @access Private
export const getArticles = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { page, perPage, query } = matchedData(req, {
    locations: ["query"],
  });

  // begin query
  const dbQuery = Article.find();

  // search by title if provided
  if (query) {
    dbQuery.where({
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
  }

  // duplicate before pagination to get total count
  const countQuery = dbQuery.clone();

  // execute count and paginate in parallel
  const [total, articles] = await Promise.all([
    countQuery.countDocuments().exec(),
    await dbQuery
      .skip(page * perPage)
      .limit(perPage)
      .exec(),
  ]);

  res.status(200).json({
    page,
    perPage,
    total,
    data: articles,
  });
});

// @desc Create new article
// @route POST /api/articles
// @access Private
export const createArticle = asyncHandler(async (req, res, next) => {
  const reqErrors = validationResult(req);
  if (!reqErrors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(reqErrors)));
  }

  const { userId, title, content } = matchedData(req, { locations: ["body"] });

  // check if the article already exists
  const foundArticle = await Article.findOne({
    $and: [{ userId }, { title }],
  }).exec();

  if (foundArticle) {
    return next(createHttpError(409, "Article already exists."));
  }

  const newArticle = new Article({
    userId,
    title,
    content,
  });

  await newArticle.save();

  res.status(201).json(newArticle);
});

// @desc Get article by ID
// @route GET /api/articles/:id
// @access Private
export const getArticleById = asyncHandler(async (req, res, next) => {
  const { id } = matchedData(req, { locations: ["params"] });

  const article = await Article.findById(id).exec();

  if (!article) {
    return next(createHttpError(404, "Article not found."));
  }

  res.status(200).json(article);
});

// @desc Update an article
// @route PATCH /api/articles/:id
// @access Private
export const updateArticle = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { id } = matchedData(req, { locations: ["params"] });
  const validatedData = matchedData(req, { locations: ["body"] });

  // check if at least one field to update is in body
  if (Object.keys(validatedData).length === 0) {
    return next(createHttpError(400, "At least one field required to update."));
  }

  // find the article to update
  const foundArticle = await Article.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true },
  ).exec();

  // check if the article exists
  if (!foundArticle) {
    return next(createHttpError(404, "Article not found."));
  }

  res.status(200).json(foundArticle);
});

// @desc Delete an article
// @route DELETE /api/articles/:id
// @access Private
export const deleteArticle = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { id } = matchedData(req, { locations: ["params"] });

  const foundArticle = await Article.findByIdAndDelete(id);

  // check if the article already exists
  if (!foundArticle) {
    return next(createHttpError(404, "Article not found."));
  }

  res.status(200).json(foundArticle);
});
