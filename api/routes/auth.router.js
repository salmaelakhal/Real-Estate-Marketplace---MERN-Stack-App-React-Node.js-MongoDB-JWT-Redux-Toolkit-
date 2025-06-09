import express from "express";
import { signup } from "../controllers/auth.controller.js"; // ← avec .js obligatoire

const router = express.Router();

router.post("/signup", signup);

export default router;
