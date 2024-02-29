import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";

export const getAllContacts = async (_, res) => {
  const contacts = await Contact.find({}, "-createdAt -updatedAt");
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id, "-createdAt -updatedAt");
  if (!result) {
    throw HttpError(404, `Contacts with id=${id} not found`);
  }
  res.json(result);
};

export const createContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

export const updateContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }
  res.json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }
  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};
