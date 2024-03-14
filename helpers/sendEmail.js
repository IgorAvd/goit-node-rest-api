import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const { SENDGRID_API_KEY, EMAIL } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

export const sendMail = async (data) => {
  const email = { ...data, from: EMAIL };
  await sgMail.send(email);
  return true;
};
