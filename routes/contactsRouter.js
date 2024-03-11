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
import { checkIsOwner } from "../middlewares/isOwner.js";
import { upload } from "../middlewares/upload.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, ctrlWrapper(getAllContacts));

contactsRouter.get(
  "/:id",
  authenticate,
  isValidId,
  checkIsOwner,
  ctrlWrapper(getOneContact)
);

contactsRouter.post(
  "/",
  authenticate,
  upload.single("avatarURL"),
  validateBody(createContactSchema),
  ctrlWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  checkIsOwner,
  validateBody(updatePutContactSchema),
  ctrlWrapper(updateContactById)
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  checkIsOwner,
  validateBody(updatePatchContactSchema),
  ctrlWrapper(updateStatusContact)
);

contactsRouter.delete(
  "/:id",
  authenticate,
  isValidId,
  checkIsOwner,
  ctrlWrapper(deleteContact)
);

export default contactsRouter;
