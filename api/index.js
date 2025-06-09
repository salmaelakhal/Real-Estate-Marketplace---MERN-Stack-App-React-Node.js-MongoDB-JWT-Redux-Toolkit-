import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";

dotenv.config();
// Importing the environment variables from .env file

// Start Express
const app = express();

// connecte à MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

  
app.listen(3000, () => {
  console.log("Server is running on port 3000!!!!!");
});

app.use("/api/users", userRouter);
