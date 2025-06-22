import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.router.js";
import { verifyToken } from "./utils/verifyUser.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
dotenv.config();
// Importing the environment variables from .env file

// Start Express
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

// connecte à MongoDB
mongoose.set("strictQuery", false); // ajoute ça dans index.js avant mongoose.connect()
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


app.listen(3000, () => {
  console.log("Server is running on port 3000!!!!!");
});
app.use("/api/user", userRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  });
});
