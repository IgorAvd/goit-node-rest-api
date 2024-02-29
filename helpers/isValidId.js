import { isValidObjectId } from "mongoose";
import HttpError from "./HttpError.js";

export const isValidId = (req, _, next) => {
  const { id } = req.params;
  const isCorrectId = isValidObjectId(id);
  if (!isCorrectId) {
    next(HttpError(400, `${id} is not correct id format`));
  }
  next();
};
