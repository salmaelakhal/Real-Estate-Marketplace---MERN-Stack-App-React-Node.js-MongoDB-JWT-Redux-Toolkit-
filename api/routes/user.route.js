import express from 'express';
import { test } from '../controllers/user.controller.js'; // ← ajoute .js !


const router = express.Router();

router.get('/test', test);
// router.put("/update/:id", updateUser);


export default router;

