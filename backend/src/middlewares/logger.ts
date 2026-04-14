import type { NextFunction, Request, RequestHandler, Response } from "express";
import fs from "fs";
import path from "path";

const fsPromises = fs.promises;

export const logEvents = async (message: string, logFileName: string) => {
  const dateTime = new Date();
  const logItem = `${dateTime}\t${message}\n`;

  try {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem,
    );
  } catch (err) {
    console.log(err);
  }
};

export const logger: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};
