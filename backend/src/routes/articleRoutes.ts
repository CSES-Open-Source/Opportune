import express from "express";
import * as articleController from "../controllers/articleController";
import * as articleValidator from "../validators/articleValidator";

const articleRouter = express.Router();

articleRouter.get(
  "/:id",
  articleValidator.getArticleValidator,
  articleController.getArticleById,
);

articleRouter.patch(
  "/:id",
  articleValidator.updateArticleValidator,
  articleController.updateArticle,
);

articleRouter.delete(
  "/:id",
  articleValidator.deleteArticleValidator,
  articleController.deleteArticle,
);

articleRouter.get("/", articleController.getArticles);

articleRouter.post(
  "/",
  articleValidator.createArticleValidator,
  articleController.createArticle,
);

export default articleRouter;
