function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(404).json({ message: "Missing required  field" });
    }
    return next();
  };
}

function tryCatchWrapper(endpointFn) {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {
  validateBody,
  tryCatchWrapper,
};
