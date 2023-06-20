import User from '#root/src/models/userModel.js'
import Vehicle from '#root/src/models/vehicleModel.js'

const userController = {
    getView: async (req, res) => {
        const userId = req.query.userId;
        const type = req.query.type;
        let action = req.query.action;
        
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userVehicles = await Vehicle.find({
            _id: { $in: user.rentedVehicles }
        });

        let typeFilters = ["Rower górski", "Hulajnoga", "Rower wyścigowy"];
        if (type === 'bike') {
            typeFilters = ["Rower górski", "Rower wyścigowy"]
        }
        if (type === 'scooter') {
            typeFilters = ["Hulajnoga"]
        }

        let allVehicles;
        if (action === 'buy') {
            allVehicles = await Vehicle.find({ buy_price: { $ne: null }, type: { $in: typeFilters }, $and: [{ rented_by: { $eq: null } }, { bought_by: { $eq: null } }] });
        } else if (action ==='rent') {
            allVehicles = await Vehicle.find({ rent_price: { $ne: null }, type: { $in: typeFilters }, $and: [{ rented_by: { $eq: null } }, { bought_by: { $eq: null } }] });
        } else {
            allVehicles = await Vehicle.find({ rented_by: { $eq: null }, bought_by: { $eq: null }, $or: [{ rent_price: { $ne: null } }, { buy_price: { $ne: null } }] });
            action = 'all';
        } 

        const vehicleGroups = allVehicles.reduce((acc, obj) => {
            const index = acc.findIndex(item => item.name === obj.name);
            if (index === -1) {
                acc.push({ name: obj.name, amount: 1 });
            } else {
                acc[index].amount++;
            }
            return acc;
        }, []).sort((a, b) => b.amount - a.amount);
        
        res.render('user', { vehicles: allVehicles, vehiclesGroup: vehicleGroups, user: user, action: action, userVehicles: userVehicles });
    },

    rentBuyVehicle: async (req, res, actionType) => {
        try {
            const { vehicleId, userId } = req.body;
            
            const vehicle = await Vehicle.findById(vehicleId);
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }

            if (vehicle.bought_by || vehicle.rented_by) {
                return res.status(400).json({ error: 'Vehicle cannot be purchased. It\' already bought or rented.' });
            }

            let actionString = '';
            if (actionType === 'buy') {
                vehicle.bought_by = user._id;
                user.boughtVehicles.push(vehicle._id);
                actionString = 'bought';
            }
            if (actionType ==='rent') {
                vehicle.rented_by = user._id;
                user.rentedVehicles.push(vehicle._id);
                actionString ='rented';
            }

            await user.save();
            await vehicle.save();

            console.log(`\n\x1b[32m${user.firstname} ${user.lastname} ${actionString} ${vehicle.name}\x1b[0m\n`);
            res.redirect(`/user?userId=${userId}`);
            // return res.status(200).json({ message: 'Vehicle purchased' });
        } catch (error) {
            let actionString = '';
            if (actionType === 'buy') {
                actionString = 'bying';
            }
            if (actionType === 'rent') {
                actionString = 'renting';
            }
            console.error(`Error with ${actionString} vehicle:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    returnVehicle: async (req, res) => {
        try {
            const { vehicleId, userId } = req.body;

            const vehicle = await Vehicle.findById(vehicleId);
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }

            if (!vehicle.rented_by || vehicle.rented_by.toString() !== userId) {
                return res.status(400).json({ message: 'Vehicle is not rented by the user' });
            }

            vehicle.rented_by = null;
            user.rentedVehicles.pull(vehicleId);

            await user.save();
            await vehicle.save();

            console.log(`\n\x1b[32m${user.firstname} ${user.lastname} returned ${vehicle.name}\x1b[0m\n`);
            res.redirect(`/user?userId=${userId}`);
            // return res.status(200).json({ message: 'Vehicle returned.' });
        } catch (error) {
            console.error(`Error with returning vehicle:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

export default userController;