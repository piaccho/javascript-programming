import express from 'express'
import indexController from '#root/src/controllers/indexController.js';

const router = express.Router();

// index view
router.get('/', indexController.getView);

// sign in user
router.get('/sign-in', indexController.signInUser);

export default router

