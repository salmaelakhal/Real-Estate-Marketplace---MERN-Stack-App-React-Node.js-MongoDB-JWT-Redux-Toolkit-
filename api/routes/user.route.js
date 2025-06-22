import express from 'express';
import { deleteUser, test, updateUser } from '../controllers/user.controller.js'; // ← ajoute .js !
import { verifyToken } from '../utils/verifyUser.js'; // ← ajoute .js !


const router = express.Router();

router.get('/test', test);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;

