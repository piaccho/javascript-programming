import express from 'express'
import adminController from '#root/src/controllers/adminController.js';

const router = express.Router();

// admin view
router.get('/', adminController.getView);

// return all bought vehicles
router.get('/return-all/bought', (req, res) => { adminController.returnAllVehicles(req, res, 'bought') });

// return all rented vehicles
router.get('/return-all/rented', (req, res) => { adminController.returnAllVehicles(req, res, 'rented') });

// add vehicle
router.post('/vehicle/add', adminController.addVehicle);

// delete vehicle
router.post('/vehicle/delete', adminController.deleteVehicle);

// edit vehicle
router.post('/vehicle/edit', adminController.editVehicle);

export default router

