import User, { UserType } from "../models/User";
import { matchedData, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import validationErrorParser from "../util/validationErrorParser";
import Company from "../models/Company";
import {
  analyzeSimilarities,
  generateSimilarityScore,
} from "../controllers/SimilarityController";

interface BaseUserResponse {
  _id?: string;
  email: string;
  name: string;
  type: string;
  profilePicture?: string;
  hobbies?: string[];
  skills?: string[];
}

interface StudentResponse extends BaseUserResponse {
  linkedIn?: string;
  phoneNumber?: string;
  major?: string;
  classLevel?: string;
  school?: string;
  fieldOfInterest?: string[];
  projects?: string[];
  companiesOfInterest?: string[];
}

interface AlumniResponse extends BaseUserResponse {
  linkedIn?: string;
  phoneNumber?: string;
  company?: string;
  shareProfile?: boolean;
  position?: string;
  organizations?: string[];
  specializations?: string[];
}

type UserResponse = StudentResponse | AlumniResponse;

// @desc Get all users
// @route GET /api/users
// @access Private
export const getUsers = asyncHandler(async (_, res) => {
  const users = await User.find()
    .populate({ path: "company", model: Company })
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
  const bodyData = matchedData(req, { locations: ["body"] });
  console.log("createUser matchedData body:", bodyData);

  const {
    _id,
    email,
    name,
    profilePicture,
    type,
    linkedIn,
    phoneNumber,
    major,
    classLevel,
    company,
    shareProfile,
    position,

    fieldOfInterest,
    projects,
    companiesOfInterest,
    hobbies,
    skills,
    organizations,
    specializations,
  } = matchedData(req, { locations: ["body"] });

  // check if the user already exists
  const foundUser = await User.findOne({
    $or: [{ _id }, { email }],
  }).exec();

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
    profilePicture,
    linkedIn,
    phoneNumber,
    major,
    classLevel,
    company,
    shareProfile,
    position,

    organizations,
    specializations,
    skills,
    hobbies,
    companiesOfInterest,
    projects,
    fieldOfInterest,
  });

  await newUser.save();

  const populatedUser = await User.findById(newUser._id)
    .populate({ path: "company", model: Company })
    .exec();

  if (!populatedUser) {
    return next(
      createHttpError(500, "Failed to populate company after user creation."),
    );
  }

  res.status(201).json(populatedUser);
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
    .exec();
  if (!foundUser) {
    return next(createHttpError(404, "User not found."));
  }

  let responseData: UserResponse = {
    _id: foundUser._id,
    email: foundUser.email,
    name: foundUser.name,
    type: foundUser.type,
    profilePicture: foundUser.profilePicture,
    hobbies: foundUser.hobbies,
    skills: foundUser.skills,
  };

  if (foundUser.type === UserType.Student) {
    responseData = {
      ...responseData,
      linkedIn: foundUser.linkedIn,
      phoneNumber: foundUser.phoneNumber,
      major: foundUser.major,
      classLevel: foundUser.classLevel,
      school: foundUser.school,
      fieldOfInterest: foundUser.fieldOfInterest,
      projects: foundUser.projects,
      hobbies: foundUser.hobbies,
      skills: foundUser.skills,
      companiesOfInterest: foundUser.companiesOfInterest,
    } as StudentResponse;
  } else {
    responseData = {
      ...responseData,
      company: foundUser.company,
      shareProfile: foundUser.shareProfile,
      position: foundUser.position,
      organizations: foundUser.organizations,
      specializations: foundUser.specializations,
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
  )
    .populate({ path: "company", model: Company })
    .exec();

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

  const { page, perPage, query, industry } = matchedData(req, {
    locations: ["query"],
  });

  const dbQuery = User.find({
    type: UserType.Alumni,
    shareProfile: true,
  });

  // combine company, position, and name filters
  if (query) {
    const companyDocs = await Company.find({
      $or: [
        { name: { $regex: new RegExp(query, "i") } },
        { industry: { $regex: new RegExp(query, "i") } },
      ],
    }).exec();

    const companyIds = companyDocs.map((company) => company._id);

    dbQuery.or([
      { name: { $regex: new RegExp(query, "i") } },
      { position: { $regex: new RegExp(query, "i") } },
      { company: { $in: companyIds } },
    ]);
  }

  // industry filter
  if (industry) {
    const industryArray = industry
      .split(",")
      .map((item: string) => new RegExp(item.trim(), "i"));

    const industryDocs = await Company.find({
      industry: { $in: industryArray },
    }).exec();

    const industryCompanyIds = industryDocs.map((company) => company._id);

    dbQuery.where("company").in(industryCompanyIds);
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
      .exec(),
  ]);

  res.status(200).json({
    page,
    perPage,
    total,
    data: users,
  });
});

export const getAlumniSimilarities = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { studentId } = matchedData(req, { locations: ["params"] });
  const { id: alumniId } = matchedData(req, { locations: ["params"] });
  if (!studentId) {
    return next(createHttpError(400, "StudentId is required"));
  }

  const [alumniUser, studentUser] = await Promise.all([
    User.findById(alumniId)
      .populate({
        path: "company",
        model: Company,
      })
      .exec(),
    User.findById(studentId).exec(),
  ]);

  if (!alumniUser) {
    return next(createHttpError(404, "Alumni user not found."));
  }

  if (!studentUser) {
    return next(createHttpError(404, "Student user not found."));
  }

  if (alumniUser.type !== UserType.Alumni) {
    return next(createHttpError(400, "User is not an alumni."));
  }

  if (studentUser.type !== UserType.Student) {
    return next(createHttpError(400, "User is not a student."));
  }

  const StudentData = {
    name: studentUser.name,
    school: studentUser.school,
    fieldOfInterest: studentUser.fieldOfInterest,
    projects: studentUser.projects,
    hobbies: studentUser.hobbies,
    skills: studentUser.skills,
    companiesOfInterest: studentUser.companiesOfInterest,
    major: studentUser.major,
    classLevel: studentUser.classLevel,
  };

  const AlumniData = {
    name: alumniUser.name,
    position: alumniUser.position,
    company: alumniUser.company,
    organizations: alumniUser.organizations,
    specializations: alumniUser.specializations,
    hobbies: alumniUser.hobbies,
    skills: alumniUser.skills,
  };

  const similarities = await analyzeSimilarities(StudentData, AlumniData);
  res.status(200).json({
    student: {
      _id: studentUser._id,
      name: studentUser.name,
      email: studentUser.email,
    },
    alumni: {
      _id: alumniUser._id,
      name: alumniUser.name,
      email: alumniUser.email,
      position: alumniUser.position,
      company: alumniUser.company,
    },
    similarities: similarities.similarities,
    summary: similarities.summary,
  });
});

export const getSimilarityScores = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { studentId } = matchedData(req, { locations: ["params"] });
  const { id: alumniId } = matchedData(req, { locations: ["params"] });
  if (!studentId) {
    return next(createHttpError(400, "StudentId is required"));
  }

  const [alumniUser, studentUser] = await Promise.all([
    User.findById(alumniId)
      .populate({
        path: "company",
        model: Company,
      })
      .exec(),
    User.findById(studentId).exec(),
  ]);

  if (!alumniUser) {
    return next(createHttpError(404, "Alumni user not found."));
  }

  if (!studentUser) {
    return next(createHttpError(404, "Student user not found."));
  }

  if (alumniUser.type !== UserType.Alumni) {
    return next(createHttpError(400, "User is not an alumni."));
  }

  if (studentUser.type !== UserType.Student) {
    return next(createHttpError(400, "User is not a student."));
  }

  const StudentData = {
    name: studentUser.name,
    school: studentUser.school,
    fieldOfInterest: studentUser.fieldOfInterest,
    projects: studentUser.projects,
    hobbies: studentUser.hobbies,
    skills: studentUser.skills,
    companiesOfInterest: studentUser.companiesOfInterest,
    major: studentUser.major,
    classLevel: studentUser.classLevel,
  };

  const AlumniData = {
    name: alumniUser.name,
    position: alumniUser.position,
    company: alumniUser.company,
    organizations: alumniUser.organizations,
    specializations: alumniUser.specializations,
    hobbies: alumniUser.hobbies,
    skills: alumniUser.skills,
  };

  const similarityScore = await generateSimilarityScore(
    StudentData,
    AlumniData,
  );
  const career = similarityScore.careerScore;
  const skill = similarityScore.skillScore;
  const project = similarityScore.projectScore;
  const organization = similarityScore.organizationScore;
  const personal = similarityScore.personalScore;
  const school = similarityScore.schoolScore;

  const finalScore =
    0.3 * career +
    0.25 * skill +
    0.15 * project +
    0.1 * organization +
    0.1 * personal +
    0.1 * school;

  res.status(200).json({
    student: {
      _id: studentUser._id,
      name: studentUser.name,
      email: studentUser.email,
    },
    alumni: {
      _id: alumniUser._id,
      name: alumniUser.name,
      email: alumniUser.email,
      position: alumniUser.position,
      company: alumniUser.company,
    },
    similarityScore: finalScore,
  });
});
