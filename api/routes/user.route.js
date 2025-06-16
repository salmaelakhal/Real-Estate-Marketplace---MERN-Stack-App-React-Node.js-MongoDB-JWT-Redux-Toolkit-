import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js'; // ← ajoute .js !
import { verifyToken } from '../utils/verifyUser.js'; // ← ajoute .js !


const router = express.Router();

router.get('/test', test);
router.put("/update/:id", verifyToken, updateUser);


export default router;

