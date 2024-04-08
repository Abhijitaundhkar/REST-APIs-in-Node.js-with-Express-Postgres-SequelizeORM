const project = require("../db/models/project");
const user = require("../db/models/user");
const catchAsync = require("../utlis/catchAsync");
const AppError = require("../utlis/appError");
const { where } = require("sequelize");

const createProject = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;
  const newProject = await project.create({
    title: body.title,
    productImage: body.productImage,
    price: body.price,
    shortDescription: body.shortDescription,
    description: body.description,
    productUrl: body.productUrl,
    category: body.category,
    tags: body.tags,
    createdBy: userId,
  });
  return res.status(201).json({
    status: "Success",
    data: newProject,
  });
});
const getAllProject = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const result = await project.findAll({
    include: user,
    where: { createdBy: userId },
  });
  if (!result) {
    return next(new AppError("no project found", 400));
  }
  return res.json({
    status: "Success",
    data: result,
  });
});
const getAllProjectByID = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const result = await project.findByPk(projectId, { include: user });
  if (!result) {
    return next(new AppError("no id found of project", 400));
  }
  return res.json({
    status: "Success",
    data: result,
  });
});
const updateProject = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const body = req.body;
  const result = await project.findOne({
    where: { id: projectId, createdBy: userId },
  });
  if (!result) {
    return next(new AppError("Project Id or user id Invalid ", 400));
  }
  (result.title = body.title),
    (result.productImage = body.productImage),
    (result.price = body.price),
    (result.shortDescription = body.shortDescription),
    (result.description = body.description),
    (result.productUrl = body.productUrl),
    (result.category = body.category),
    (result.tags = body.tags);
  const updatedResult = await result.save();
  return res.json({
    status: "Success",
    data: result,
  });
});
const deleteProject = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const body = req.body;
  let result = await project.findOne({
    where: { id: projectId, createdBy: userId },
  });
  if (!result) {
    return next(new AppError("Project Id Invalid ", 400));
  }
  await result.destroy();
  return res.json({
    status: "Success",
    message: "record deleted",
  });
});

module.exports = {
  createProject,
  getAllProject,
  getAllProjectByID,
  updateProject,
  deleteProject,
};
