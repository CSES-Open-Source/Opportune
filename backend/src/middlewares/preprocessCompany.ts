import { NextFunction, Request, Response } from "express";

const preprocessCompany = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.body.company &&
    typeof req.body.company === "object" &&
    "_id" in req.body.company
  ) {
    req.body.company = req.body.company._id;
  }
  next();
};

export default preprocessCompany;
