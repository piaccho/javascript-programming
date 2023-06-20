import express from 'express';
import userController from '#root/src/controllers/userController.js';

const router = express.Router();

// user view
router.get('/', userController.getView);

// buy vehicle
router.post('/buy', (req, res) => { userController.rentBuyVehicle(req, res, 'buy') });

// rent vehicle
router.post('/rent', (req, res) => { userController.rentBuyVehicle(req, res, 'rent') });

// return vehicle
router.post('/return', userController.returnVehicle);

export default router;

