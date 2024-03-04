const isConflict = ({ name, code }) =>
  name === "MongoServerError" && code === 11000;
export const handleSchemaValidationError = (error, data, next) => {
  error.status = isConflict(error) ? 409 : 400;
  next();
};
