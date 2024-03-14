import HttpError from "../helpers/HttpError.js";
import { UserModel } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import jimp from "jimp";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { nanoid } from "nanoid";
import { sendMail } from "../helpers/sendEmail.js";

dotenv.config();

const { SECRET_KEY, BASE_URL } = process.env;

export const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const newUser = await UserModel.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `
      <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">
  Click here to verify your email
</a>
    `,
  };
  await sendMail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await UserModel.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404);
  }
  await UserModel.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  res.json({ message: "Verification successful" });
};

export const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpError(404);
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `
      <a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">
  Click here to verify your email
</a>
    `,
  };
  await sendMail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await UserModel.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

export const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

export const logout = async (req, res) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

export const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  if (!req.body) {
    throw HttpError(400, "Subscription is required");
  }
  const { email, subscription } = await UserModel.findByIdAndUpdate(
    _id,
    req.body,
    {
      new: true,
    }
  );
  if (!email || !subscription) {
    throw HttpError(404);
  }
  res.status(201).json({ email, subscription });
};

export const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const AvatarDir = path.join(__dirname, "../", "public", "avatars");
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(AvatarDir, fileName);
  const image = await jimp.read(tempUpload);
  image.resize(250, 250).write(resultUpload);
  await fs.unlink(tempUpload);
  const avatarURL = path.join("avatars", fileName);
  await UserModel.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};
