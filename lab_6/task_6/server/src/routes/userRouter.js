import express from 'express';
import userController from '#root/src/controllers/userController.js';

const router = express.Router();

router.all('/', (req, res) => {
    if(req.method === 'GET') {
        const { userId } = req.query;
        
        // main view and filters
        if (userId) {
            userController.getView(req, res);
        } else {
            res.status(400).json({ error: 'Missing userId' });
        }
    } else if (req.method === 'POST') {
        const { userId, vehicleName, vehicleId } = req.body;

        if (userId) {
            console.log("RENTING OR BUYING VEHICLE");
            // rent or buy vehicle
            if(vehicleName) {
                userController.rentBuyVehicle(req, res);
            }
            console.log("RETURNING VEHICLE");
            // return vehicle
            if(vehicleId) {
                userController.returnVehicle(req, res);
            }
        } else {
            res.status(400).json({ error: 'Missing userId' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});

export default router;

