import User from '#root/src/models/userModel.js'
import Vehicle from '#root/src/models/vehicleModel.js'


const userController = {
    getView: async (req, res) => {
        
        const { userId, action, type } = req.query;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const userRentedVehicles = await Vehicle.find({
            _id: { $in: user.rentedVehicles }
        });

        const userBoughtVehicles = await Vehicle.find({
            _id: { $in: user.boughtVehicles }
        });

        let typeFilters = ["Rower górski", "Hulajnoga", "Rower wyścigowy"];
        if (type === 'bike') typeFilters = ["Rower górski", "Rower wyścigowy"];
        if (type === 'scooter') typeFilters = ["Hulajnoga"];
        
        const query = { rented_by: { $eq: null }, bought_by: { $eq: null }, type: { $in: typeFilters } }
        if (action === 'buy') {
            query.buy_price = { $ne: null };
        } else if (action ==='rent') {
            query.rent_price = { $ne: null };
        } else {
            query.$or = [{ rent_price: { $ne: null } }, { buy_price: { $ne: null } }];
        }
        const allVehicles = await Vehicle.find(query);

        let groupIndex = 0;
        const vehicleGroups = allVehicles.reduce((acc, obj) => {
            const index = acc.findIndex(item => item.name === obj.name);
            if (index === -1) {
                acc.push({ groupIndex: groupIndex, type: obj.type, brand: obj.brand, model: obj.model, name: obj.name, rent_price: obj.rent_price, buy_price: obj.buy_price, img_url: obj.img_url, amount: 1 });
                groupIndex++;
            } else {
                acc[index].amount++;
            }
            return acc;
        }, [])

        res.json({ userRentedVehicles: userRentedVehicles, userBoughtVehicles: userBoughtVehicles, vehicleGroups: vehicleGroups});
    },

    rentBuyVehicle: async (req, res) => {
        try {
            const { userId, vehicleName, type } = req.body;
            
            const vehicle = await Vehicle.findOne({name: vehicleName, rented_by: null, bought_by: null});
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!vehicle) {
                return res.status(404).json({ error: 'There are no more of this vehicle' });
            }

            let actionString = '';
            if (type === 'buy') {
                vehicle.bought_by = user._id;
                user.boughtVehicles.push(vehicle._id);
                actionString = 'bought';
            }
            if (type ==='rent') {
                vehicle.rented_by = user._id;
                user.rentedVehicles.push(vehicle._id);
                actionString ='rented';
            }

            await user.save();
            await vehicle.save();

            const leftVehicles = await Vehicle.find({ rented_by: null, bought_by: null, name: vehicleName });

            console.log(`\n\x1b[32m${user.firstname} ${user.lastname} ${actionString} ${vehicle.name}\x1b[0m\n`);
            return res.status(200).json({ message: `Vehicle ${actionString}`, leftVehicles: leftVehicles.length });

        } catch (error) {
            let actionString = '';
            if (type === 'buy') {
                actionString = 'bying';
            }
            if (type === 'rent') {
                actionString = 'renting';
            }
            console.error(`Error with ${actionString} vehicle:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    returnVehicle: async (req, res) => {
        try {
            const { userId, vehicleId } = req.body;

            const vehicle = await Vehicle.findById(vehicleId);
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }

            if ((!vehicle.rented_by || vehicle.rented_by.toString() !== userId) && (!vehicle.bought_by || vehicle.bought_by.toString() !== userId)) {
                return res.status(400).json({ message: 'Vehicle is not rented/bought by the user' });
            }

            if (vehicle.rented_by && vehicle.rented_by.toString() === userId) {
                vehicle.rented_by = null;
                user.rentedVehicles.pull(vehicleId);
            } 
            if (vehicle.bought_by && vehicle.bought_by.toString() === userId) { 
                vehicle.bought_by = null;
                user.boughtVehicles.pull(vehicleId);
            }

            await user.save();
            await vehicle.save();

            console.log(`\n\x1b[32m${user.firstname} ${user.lastname} returned ${vehicle.name}\x1b[0m\n`);
            return res.status(200).json({ message: 'Vehicle returned.' });

        } catch (error) {
            console.error(`Error with returning vehicle:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

export default userController;