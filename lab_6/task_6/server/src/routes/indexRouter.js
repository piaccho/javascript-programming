import express from 'express'
import indexController from '#root/src/controllers/indexController.js';

const router = express.Router();

// index view
router.get('/', indexController.getLoginView);

router.post('/', indexController.getUserView);

export default router

