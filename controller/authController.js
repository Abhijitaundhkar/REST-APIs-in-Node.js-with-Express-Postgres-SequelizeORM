const user = require("../db/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utlis/catchAsync");
const AppError = require("../utlis/appError");
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};
const signUp = catchAsync(async (req, res, next) => {
  const { userType, firstName, lastName, email, password, confirmPassword } =
    req.body;
  if (!["1", "2"].includes(userType)) {
    return next(new AppError("Invalid user type ", 400));
  }
  // return res.status(400).json({
  //   status: "fail",
  //   message: "Invalid user type",
  // });
  if (confirmPassword !== password) {
    throw new AppError("Password are not match ", 400);
    // return next(new AppError("Password are not match ", 400));
  }
  const hashPassword = bcrypt.hashSync(password, 10);
  const newUser = await user.create({
    userType: userType,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashPassword,
  });
  if (!newUser) {
    return next(new AppError("failed to create new User", 400));
  }
  const result = newUser.toJSON();
  delete result.password;
  delete result.deleteAt;

  result.token = generateToken({
    id: result.id,
  });

  return res.status(201).json({
    status: "Success",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const result = await user.findOne({ where: { email } });
  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Incorrect provide email and password", 400));
  }
  const token = generateToken({
    id: result.id,
  });
  return res.json({
    status: "Success",
    token,
  });
});
const authentication = catchAsync(async (req, res, next) => {
  let idToken = "";
  //get token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //Bearer slsdlskdls
    idToken = req.headers.authorization.split(" ")[1];
  }
  if (!idToken) {
    return next(new AppError("Please login to get access", 401));
  }
  //token verify
  const tokenDetails = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
  console.log(tokenDetails.id);
  //get the user deatils from db and add to req object
  const freshUser = await user.findByPk(tokenDetails.id);
  if (!freshUser) {
    return next(new AppError("User no loner existes", 400));
  }
  req.user = freshUser;
  return next();
});

const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You dont have permission to perform this action", 403)
      );
    }
    return next();
  };
  return checkPermission;
};

module.exports = { signUp, login, authentication, restrictTo };
