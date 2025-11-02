import express from "express";
import * as userController from "../controllers/userController";
import preprocessCompany from "../middlewares/preprocessCompany";
import * as userValidator from "../validators/userValidator";

const userRouter = express.Router();

userRouter.get(
  "/alumni",
  userValidator.getOpenAlumniValidator,
  userController.getOpenAlumni,
);

userRouter.get(
  "/:id",
  userValidator.getUservalidator,
  userController.getUserById,
);

userRouter.patch(
  "/:id",
  preprocessCompany,
  userValidator.updateUserValidator,
  userController.updateUser,
);

userRouter.delete(
  "/:id",
  userValidator.deleteUserValidator,
  userController.deleteUser,
);

userRouter.get("/", userController.getUsers);

userRouter.post(
  "/",
  preprocessCompany,
  userValidator.createUserValidator,
  userController.createUser,
);

export default userRouter;
