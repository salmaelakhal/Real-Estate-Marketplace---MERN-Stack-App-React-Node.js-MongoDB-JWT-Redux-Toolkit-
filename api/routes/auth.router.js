import express from "express";
import { signout, signup } from "../controllers/auth.controller.js"; // ← avec .js obligatoire
import { signin } from "../controllers/auth.controller.js"; // ← avec .js obligatoire
import { google } from "../controllers/auth.controller.js"; // ← avec .js obligatoire

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.post("/google", google);

export default router;
