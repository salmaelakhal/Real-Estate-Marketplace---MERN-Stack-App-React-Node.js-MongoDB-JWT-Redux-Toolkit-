import express from 'express';
import {
  deleteUser,
  getUserListings,
  test,
  updateUser,
  getUser,
} from "../controllers/user.controller.js"; // ← ajoute .js !
import { verifyToken } from '../utils/verifyUser.js'; // ← ajoute .js !


const router = express.Router();

router.get('/test', test);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser); 
export default router;

