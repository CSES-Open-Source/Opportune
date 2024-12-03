import User, { UserType } from "src/models/User";
import { matchedData, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import validationErrorParser from "src/util/validationErrorParser";
import Company from "src/models/Company";
import mongoose from "mongoose";

interface BaseUserResponse {
  _id?: string;
  email: string;
  name: string;
  type: string;
}

interface StudentResponse extends BaseUserResponse {
  linkedIn?: string;
  phoneNumber?: string;
  major?: string;
  classLevel?: string;
}

interface AlumniResponse extends BaseUserResponse {
  linkedIn?: string;
  phoneNumber?: string;
  company?: mongoose.Types.ObjectId;
  shareProfile?: boolean;
}

type UserResponse = StudentResponse | AlumniResponse;

// @desc Get all users
// @route GET /api/users
// @access Private
export const getUsers = asyncHandler(async (_, res) => {
  const users = await User.find()
    .populate({ path: "company", model: Company })
    .lean()
    .exec();

  res.status(200).json(users);
});

// @desc Create new user
// @route POST /api/users
// @access Private
export const createUser = asyncHandler(async (req, res, next) => {
  const reqErrors = validationResult(req);
  if (!reqErrors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(reqErrors)));
  }

  const {
    _id,
    email,
    name,
    type,
    linkedIn,
    phoneNumber,
    major,
    classLevel,
    company,
    shareProfile,
  } = matchedData(req, { locations: ["body"] });

  // check if the user already exists
  const foundUser = await User.findOne({
    $or: [{ _id }, { email }],
  })
    .lean()
    .exec();

  if (foundUser) {
    return next(createHttpError(409, "User already exists."));
  }

  // find company, if not found, create a new company
  // figure out internal api calls in a future PR?

  const newUser = new User({
    _id,
    email,
    name,
    type,
    linkedIn,
    phoneNumber,
    major,
    classLevel,
    company,
    shareProfile,
  });

  await newUser.save();

  res.status(201).json(newUser);
});

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private
export const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = matchedData(req, { locations: ["params"] });

  // check if the user exists
  const foundUser = await User.findById(id)
    .populate({
      path: "company",
      model: Company,
    })
    .lean()
    .exec();
  if (!foundUser) {
    return next(createHttpError(404, "User not found."));
  }

  let responseData: UserResponse = {
    _id: foundUser._id,
    email: foundUser.email,
    name: foundUser.name,
    type: foundUser.type,
  };

  if (foundUser.type === UserType.Student) {
    responseData = {
      ...responseData,
      linkedIn: foundUser.linkedIn,
      phoneNumber: foundUser.phoneNumber,
      major: foundUser.major,
      classLevel: foundUser.classLevel,
    } as StudentResponse;
  } else {
    responseData = {
      ...responseData,
      company: foundUser.company,
      shareProfile: foundUser.shareProfile,
    } as AlumniResponse;

    if (foundUser.shareProfile) {
      responseData.linkedIn = foundUser.linkedIn;
      responseData.phoneNumber = foundUser.phoneNumber;
    }
  }

  res.status(200).json(responseData);
});

// @desc Update a user
// @route PATCH /api/users/:id
// @access Private
export const updateUser = asyncHandler(async (req, res, next) => {
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

  // find company, if not found, create a new company
  // figure out internal api calls in a future PR?

  // find the user to update
  const foundUser = await User.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true },
  );

  // check if the user exists
  if (!foundUser) {
    return next(createHttpError(404, "User not found."));
  }

  res.status(200).json(foundUser);
});

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private
export const deleteUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { id } = matchedData(req, { locations: ["params"] });

  const foundUser = await User.findByIdAndDelete(id);

  // check if the user already exists
  if (!foundUser) {
    return next(createHttpError(404, "User not found."));
  }

  res.status(200).json(foundUser);
});

// @desc Get alumni willing to share profile
// @route GET /api/users/alumni
// @access Private
export const getOpenAlumni = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { page, perPage, query } = matchedData(req, { locations: ["query"] });

  const dbQuery = User.find({
    type: UserType.Alumni,
    shareProfile: true,
  });

  // add a name search filter if provided
  if (query) {
    dbQuery.where("name").regex(new RegExp(query, "i"));
  }

  // ensure count and paginate do not conflict
  const countQuery = dbQuery.clone();

  // count total results, populate company, and paginate in parallel
  const [total, users] = await Promise.all([
    countQuery.countDocuments(),
    dbQuery
      .skip(page * perPage)
      .limit(perPage)
      .populate({ path: "company", model: Company })
      .lean()
      .exec(),
  ]);

  res.status(200).json({
    page,
    perPage,
    total,
    data: users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      linkedIn: user.linkedIn,
      phoneNumber: user.phoneNumber,
      company: user.company,
      shareProfile: user.shareProfile,
    })),
  });
});
