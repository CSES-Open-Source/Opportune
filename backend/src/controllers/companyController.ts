import s3Upload from "src/aws/s3Upload";
import Company from "src/models/Company";
import { matchedData, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import validationErrorParser from "src/util/validationErrorParser";

// @desc Get companies matching the query
// @route GET /api/companies
// @access Private
export const getCompanies = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { page, perPage, query, state, industry, employees } = matchedData(
    req,
    {
      locations: ["query"],
    },
  );

  // Begin query
  const dbQuery = Company.find();

  // Search by name if provided
  if (query) {
    dbQuery.where("name").regex(new RegExp(query, "i"));
  }

  // Filter by state if provided
  if (state) {
    dbQuery.where("state").regex(new RegExp(state, "i"));
  }

  // Filter by industry if provided
  if (industry) {
    const industryArray = industry
      .split(",")
      .map((item: string) => item.trim());
    dbQuery.where("industry").in(industryArray);
  }

  // Filter by employees if provided
  if (employees) {
    dbQuery.where("employees").regex(new RegExp(employees, "i"));
  }

  // Duplicate before pagination to get total count
  const countQuery = dbQuery.clone();

  // Execute count and paginate in parallel
  const [total, companies] = await Promise.all([
    countQuery.countDocuments().exec(),
    await dbQuery
      .skip(page * perPage)
      .limit(perPage)
      .exec(),
  ]);

  res.status(200).json({
    page,
    perPage,
    total,
    data: companies,
  });
});

// @desc Get all companies
// @route GET /api/companies/all
// @access Private
export const getAllCompanies = asyncHandler(async (_, res) => {
  const companies = await Company.find().exec();

  res.status(200).json(companies);
});

// @desc Create a new company
// @route POST /api/companies
// @access Private
export const createCompany = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { name, city, state, employees, industry, url } = matchedData(req, {
    locations: ["body"],
  });

  // Check if company already exists with case insensitive collation
  const foundCompany = await Company.findOne({ name })
    .collation({ locale: "en", strength: 2 }) // future localization?
    .exec();

  if (foundCompany) {
    return next(createHttpError(409, "Company already exists."));
  }

  let logoKey = null;
  if (req.file) {
    logoKey = await s3Upload(req.file);
  }

  const newCompany = new Company({
    name,
    city,
    state,
    logoKey,
    employees,
    industry,
    url,
  });
  await newCompany.save();

  res.status(201).json(newCompany);
});

// @desc Get company by ID
// @route GET /api/companies/:id
// @access Private
export const getCompanyById = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { id } = matchedData(req, { locations: ["params"] });

  const company = await Company.findById(id).exec();

  if (!company) {
    return next(createHttpError(404, "Company not found."));
  }

  res.status(200).json(company);
});

// @desc Update company by ID
// @route PATCH /api/companies/:id
// @access Private
export const updateCompany = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { id } = matchedData(req, { locations: ["params"] });
  const validatedData = matchedData(req, { locations: ["body"] });

  // Check if at least one field to update is provided
  if (Object.keys(validatedData).length === 0) {
    return next(createHttpError(400, "At least one field to update required."));
  }

  if (req.file) {
    validatedData.logoKey = await s3Upload(req.file);
  }

  const foundCompany = await Company.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true },
  );

  // Check if company exists
  if (!foundCompany) {
    return next(createHttpError(404, "Company not found."));
  }

  res.status(200).json(foundCompany);
});

// @desc Delete company by ID
// @route DELETE /api/companies/:id
// @access Private
export const deleteCompany = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { id } = matchedData(req, { locations: ["params"] });

  const foundCompany = await Company.findByIdAndDelete(id).exec();

  // Return 404 if company not found
  if (!foundCompany) {
    return next(createHttpError(404, "Company not found."));
  }

  res.status(200).send(foundCompany);
});
