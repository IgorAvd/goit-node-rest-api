import HttpError from "../helpers/HttpError.js";
import {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await getContactById(id);
  if (!result) {
    throw HttpError(404, `Contacts with id=${id} not found`);
  }
  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export const createContact = async (req, res) => {
  const result = await addContact(req.body);

  res.status(201).json(result);
};

export const updateContactById = async (req, res) => {
  const { id } = req.params;
  const result = await updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }
  res.json(result);
};
