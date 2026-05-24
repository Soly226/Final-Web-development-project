import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { 
  registerValidationRules, 
  loginValidationRules, 
  validateRequest 
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerValidationRules, validateRequest, registerUser);
router.post('/login', loginValidationRules, validateRequest, loginUser);

export default router;
