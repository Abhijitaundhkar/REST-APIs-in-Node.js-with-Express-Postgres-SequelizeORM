const catchAsync = (fn) => {
  const errorhandler = (req, res, next) => {
    fn(req, res, next).catch(next);
  };
  return errorhandler;
};
module.exports = catchAsync;
