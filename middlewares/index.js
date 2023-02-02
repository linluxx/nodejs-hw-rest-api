const jwt = require("jsonwebtoken");
const { JWT_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;
const multer = require("multer");
const path = require("path");
const Jimp = require("jimp");
const nodemailer = require("nodemailer");

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
    const { id } = jwt.verify(token, JWT_SECRET);
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../tmp"));
  },
  filename: function (req, file, cb) {
    const { _id } = req.user;
    cb(null, _id + file.originalname);
  },
});

const upload = multer({
  storage,
});

async function resizeAvatar(req, res, next) {
  const { path } = req.file;

  try {
    const avatar = await Jimp.read(path);
    const resizedAvatar = avatar.resize(250, 250);
    await resizedAvatar.writeAsync(path);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}

async function sendMail({ to, subject, html }) {
  const email = {
    from: "support@myphonebook.com",
    to,
    subject,
    html,
  };

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  await transport.sendMail(email);
}

module.exports = {
  sendMail,
  validateBody,
  tryCatchWrapper,
  auth,
  upload,
  resizeAvatar,
};
