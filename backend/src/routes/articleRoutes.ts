import express from "express";
import * as articleController from "src/controllers/articleController";
import * as articleValidator from "src/validators/articleValidator";

const userRouter = express.Router();

userRouter.get(
  "/:id",
  articleValidator.getArticleValidator,
  articleController.getArticleById,
);

userRouter.patch(
  "/:id",
  articleValidator.updateArticleValidator,
  articleController.updateArticle,
);

userRouter.delete(
  "/:id",
  articleValidator.deleteArticleValidator,
  articleController.deleteArticle,
);

userRouter.get("/", articleController.getArticles);

userRouter.post(
  "/",
  articleValidator.createArticleValidator,
  articleController.createArticle,
);

export default userRouter;
