import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactById,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { validateBody } from "../helpers/validateBody.js";
import {
  createContactSchema,
  updatePutContactSchema,
  updatePatchContactSchema,
} from "../models/contact.js";
import { isValidId } from "../helpers/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ctrlWrapper(getAllContacts));

contactsRouter.get("/:id", isValidId, ctrlWrapper(getOneContact));

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  ctrlWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updatePutContactSchema),
  ctrlWrapper(updateContactById)
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updatePatchContactSchema),
  ctrlWrapper(updateStatusContact)
);

contactsRouter.delete("/:id", isValidId, ctrlWrapper(deleteContact));

export default contactsRouter;
