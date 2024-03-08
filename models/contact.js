import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSchemaValidationError } from "../helpers/handleSchemaValidationError.js";

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email"],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Set phone"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSchemaValidationError);

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool(),
});

export const updatePutContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.bool(),
});

export const updatePatchContactSchema = Joi.object({
  favorite: Joi.bool().required(),
});

export const Contact = model("contact", contactSchema);
