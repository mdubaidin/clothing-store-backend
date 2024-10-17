import express from 'express';
import fetch from '../controllers/user/fetch.js';
import fetchProfile from '../controllers/profile/fetch.js';

const userRouter = express.Router();

// GET
userRouter.get('/profile', fetchProfile);
userRouter.get('/', fetch);
userRouter.get('/:id', fetch);

export default userRouter;
