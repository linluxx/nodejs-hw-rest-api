const jwt = require("jsonwebtoken");
const { Users } = require("../models/users");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
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

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer") {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
  if (!token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(id);
    if (!user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    console.log("user", user);
    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message: "jwt token is not valid",
      });
    }
    throw error;
  }
  next();
}

module.exports = {
  validateBody,
  tryCatchWrapper,
  auth,
};
