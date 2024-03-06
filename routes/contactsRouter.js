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
import { validateBody } from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updatePutContactSchema,
  updatePatchContactSchema,
} from "../models/contact.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, ctrlWrapper(getAllContacts));

contactsRouter.get("/:id", authenticate, isValidId, ctrlWrapper(getOneContact));

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  ctrlWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(updatePutContactSchema),
  ctrlWrapper(updateContactById)
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(updatePatchContactSchema),
  ctrlWrapper(updateStatusContact)
);

contactsRouter.delete(
  "/:id",
  authenticate,
  isValidId,
  ctrlWrapper(deleteContact)
);

export default contactsRouter;
