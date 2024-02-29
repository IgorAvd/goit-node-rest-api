import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
//XVQ7V0stgMIW50am

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// app.listen(3000, () => {
//   console.log("Server is running. Use our API on port: 3000");
// });

const { DB_HOST, PORT = 3000 } = process.env;
mongoose
  .connect(DB_HOST)
  // .connect(DB_HOST, { dbName: "db-contacts" })
  .then(() => {
    app.listen(PORT, function () {
      console.log("Database connection successful");
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
