import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";

export const checkIsOwner = async (req, _, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const existingContact = await Contact.findById(id)
    .select("-createdAt -updatedAt")
    .where("owner")
    .equals(owner);
  if (!existingContact) {
    next(HttpError(404, "Not found"));
  }
  req.contact = existingContact;
  next();
};
