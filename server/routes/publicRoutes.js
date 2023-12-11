import express from 'express';
import { userRegister, userLogin, userLogout } from '../controller/userController.js';
import { refreshAccessToken } from '../services/authService.js';
import authMiddleware from '../middleware/auth_jwt.js';

const publicRouter = express.Router();

publicRouter.post('/register', userRegister);
publicRouter.post('/login', userLogin);
publicRouter.post('/logout', userLogout);
publicRouter.get('/token', refreshAccessToken)

// Protected route
publicRouter.use(authMiddleware);
publicRouter.get('/protected', (req, res) => {
  res.status(200).json({ message: 'Protected route' });
});

export default publicRouter;