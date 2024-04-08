require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const catchAsync = require("./utlis/catchAsync");
const { error } = require("console");
const AppError = require("./utlis/appError");
const globalErrorhandler = require("./controller/errorController");
const app = express();

app.use(express.json());
//all routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
//if api is not found
app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`cannot find ${req.originalUrl} on this server`, 404);
  })
);
app.use(globalErrorhandler);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
