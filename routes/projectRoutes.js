const express = require("express");
const {
  createProject,
  getAllProject,
  getAllProjectByID,
  updateProject,
  deleteProject,
} = require("../controller/projectController");
const { authentication, restrictTo } = require("../controller/authController");

const routers = express.Router();

routers.post("/createProject", authentication, restrictTo("1"), createProject);
routers.get("/get", authentication, restrictTo("1"), getAllProject);
routers.get("/:id", authentication, restrictTo("1"), getAllProjectByID);
routers.put("/:id", authentication, restrictTo("1"), updateProject);
routers.delete("/:id", authentication, restrictTo("1"), deleteProject);
module.exports = routers;
