const { Users } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const { v4 } = require("uuid");
const { sendMail } = require("../middlewares");

const { JWT_SECRET } = process.env;

async function register(req, res, next) {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatar = gravatar.url(email, { protocol: "http" });
  try {
    const verificationToken = v4();
    const savedUser = await Users.create({
      email,
      password: hashedPassword,
      avatarURL: avatar,
      verificationToken,
    });

    await sendMail({
      to: email,
      subject: "Email confirmation",
      html: `<a href="localhost:3000/users/verify/${verificationToken}">Please confirm your email</a>`,
    });
    res.status(201).json({
      user: {
        email,
        subscription: savedUser.subscription,
      },
    });
  } catch (err) {
    if (err.message.includes("E11000 duplicate key error")) {
      return res.status(409).json({ message: "Email in use" });
    }
    throw err;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const existedUser = await Users.findOne({ email });
  if (!existedUser) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  if (!existedUser.verify) {
    return res
      .status(401)
      .json({ message: "Email is not verified. Please check your mail box" });
  }
  const isPasswordValid = await bcrypt.compare(password, existedUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const token = jwt.sign({ id: existedUser._id }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.status(200).json({
    token: token,
    user: {
      email,
      subscription: existedUser.subscription,
    },
  });
}

async function current(req, res, next) {
  const { user } = req;
  const { email, subscription } = user;
  return res.status(200).json({
    email,
    subscription,
  });
}

async function logout(req, res, next) {
  const { _id } = req.user;
  const userForLogout = await Users.findByIdAndUpdate(_id, { token: null });
  console.log(userForLogout);
  res.status(204).json();
}

async function subscriptionStatusUpdate(req, res, next) {
  const body = req.body;
  const subscription = body.subscription;
  const { _id, email } = req.user;

  const types = ["starter", "pro", "business"];
  for (const type of types) {
    if (subscription === type) {
      const updatedSubscription = await Users.findByIdAndUpdate(_id, body, {
        new: true,
      });
      if (!updatedSubscription) {
        return res.status(404).json({
          message: "Not found",
        });
      }
      return res.status(200).json({
        user: {
          email,
          subscription: updatedSubscription.subscription,
        },
      });
    }
  }
  return res
    .status(404)
    .json({ message: "This type of subscription does not exist. Try again" });
}

async function updateAvatar(req, res, next) {
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(__dirname, "../public/avatars", filename);
  const { _id } = req.user;

  try {
    await fs.rename(tmpPath, publicPath);
    const user = await Users.findByIdAndUpdate(
      _id,
      { avatarURL: `/avatars/${filename}` },
      { new: true }
    );

    return res.status(200).json({ avatarURL: `/avatars/${filename}` });
  } catch (error) {
    await fs.unlink(tmpPath);
    console.error("error while moving file to avatars", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function verification(req, res, next) {
  const { verificationToken } = req.params;
  const user = await Users.findOne({
    verificationToken: verificationToken,
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await Users.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  return res.status(200).json({ message: "Verification successful" });
}

async function reverification(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }
  const user = await Users.findOne({
    email,
  });

  const { verificationToken, verify } = user;

  if (verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }
  await sendMail({
    to: email,
    subject: "Email confirmation",
    html: `<a href="localhost:3000/users/verify/${verificationToken}">Please confirm your email</a>`,
  });

  return res.status(200).json({ message: "Verification email sent" });
}

module.exports = {
  register,
  login,
  current,
  verification,
  logout,
  subscriptionStatusUpdate,
  updateAvatar,
  reverification,
};
