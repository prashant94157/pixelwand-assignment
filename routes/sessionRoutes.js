import express from 'express';

import {
  authUser,
  logoutUser,
  registerUser,
} from '../controllers/sessionControllers.js';
import { protect } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/login', authUser);

router.patch('/logout', protect, logoutUser);

router.post('/', registerUser);

export default router;
