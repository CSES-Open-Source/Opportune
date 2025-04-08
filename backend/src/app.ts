import "dotenv/config";
import cors from "cors";
import express from "express";
import userRouter from "src/routes/userRoutes";
import companyRouter from "src/routes/companyRoutes";
import applicationRouter from "src/routes/applicationRoutes";
import savedApplicationRouter from "src/routes/savedApplicationRoutes";
import leetcodeQuestionRouter from "src/routes/leetcodeQuestionRoutes";
import interviewQuestionRouter from "../src/routes/InterviewQuestionRoutes";
import errorHandler from "src/middlewares/errorHandler";
import { logger } from "src/middlewares/logger";

const app = express();

// initializes Express to accept JSON in the request/response body
app.use(express.json());

// Log requests to backend
app.use(logger);

// sets the "Access-Control-Allow-Origin" header on all responses to allow
// requests from the frontend, which has a different origin - see the following
// pages for more info:
// https://expressjs.com/en/resources/middleware/cors.html
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  }),
);

app.use("/api/users", userRouter);
app.use("/api/applications/applied", applicationRouter);
app.use("/api/companies", companyRouter);
app.use("/api/applications/saved", savedApplicationRouter);
app.use("/api/questions/leetcode", leetcodeQuestionRouter);
app.use("/api/questions/interview", interviewQuestionRouter);

/**
 * Error handler; all errors thrown by server are handled here.
 * Explicit typings required here because TypeScript cannot infer the argument types.
 */
app.use(errorHandler);

export default app;
