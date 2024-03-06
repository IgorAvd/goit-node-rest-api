import HttpError from "../helpers/HttpError.js";
import { UserModel } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { SECRET_KEY } = process.env;

export const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({
    ...req.body,
    password: hashPassword,
  });
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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
