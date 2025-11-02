import { NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";
import { logEvents } from "../middlewares/logger";

const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) => {
  // 500 is the "internal server error" error code, this will be our fallback
  let statusCode = 500;
  let errorMessage = "An error has occurred.";

  // check is necessary because anything can be thrown, type is not guaranteed
  if (isHttpError(error)) {
    // error.status is unique to the http error class, it allows us to pass status codes with errors
    statusCode = error.status;
    errorMessage = error.message;
    logEvents(
      `${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log",
    );
  }
  // prefer custom http errors but if they don't exist, fallback to default
  else if (error instanceof Error) {
    errorMessage = error.message;
    logEvents(
      `${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log",
    );
  }

  res.status(statusCode).json({ error: errorMessage });
};

export default errorHandler;
