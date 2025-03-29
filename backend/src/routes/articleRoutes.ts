import express from "express";
import * as articleController from "src/controllers/articleController";
import * as articleValidator from "src/validators/articleValidator";

const userRouter = express.Router();

/*
For GET /api/articles, the return type should be { page, perPage, total, data }, 
and the query is the search keyword, which should search both the title and 
content of the article (feel free to just use the regex search built into mongoDB)
*/

userRouter.get(
  "/alumni",
  articleValidator.getOpenAlumniValidator,
  articleController.getOpenAlumni,
);

userRouter.get(
  "/:id",
  articleValidator.getarticleValidator,
  articleController.getUserById,
);

userRouter.patch(
  "/:id",
  articleValidator.updatearticleValidator,
  articleController.updateUser,
);

userRouter.delete(
  "/:id",
  articleValidator.deletearticleValidator,
  articleController.deleteUser,
);

userRouter.get("/", articleController.getUsers);

userRouter.post(
  "/",
  articleValidator.createarticleValidator,
  articleController.createUser,
);

export default userRouter;
