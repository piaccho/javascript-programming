import User from '#root/src/models/userModel.js'
import Vehicle from '#root/src/models/vehicleModel.js'

const adminController = {
    getView: async (req, res) => {
        const allVehicles = await Vehicle.find();

        const vehicleGroups = allVehicles.reduce((acc, obj) => {
            const index = acc.findIndex(item => item.name === obj.name);
            if (index === -1) {
                acc.push({ name: obj.name, amount: 1 });
            } else {
                acc[index].amount++;
            }
            return acc;
        }, []).sort((a, b) => b.amount - a.amount);

        res.render('admin', { vehicles: allVehicles, vehiclesGroup: vehicleGroups });
    },

    returnAllVehicles: async (req, res, actionType) => {
        try {
            const vehiclesToReturn = await Vehicle.find(actionType === 'rented' ? { rented_by: { $ne: null } } : { bought_by: { $ne: null } });
            
            for (const vehicle of vehiclesToReturn) {
                const user = await User.findById(actionType === 'rented' ? vehicle.rented_by : vehicle.bought_by);
                
                if (user) {
                    if (actionType === 'rented') {
                        user.rentedVehicles.pull(vehicle._id);
                        vehicle.rented_by = null;
                    }
                    if (actionType === 'bought') {
                        user.boughtVehicles.pull(vehicle._id);
                        vehicle.bought_by = null;
                    }

                    await user.save();
                    await vehicle.save();
                }
            }

            console.log(`\n\x1b[32mReturned all ${vehiclesToReturn.length} ${actionType} vehicles\x1b[0m\n`);
            res.redirect(`/admin`);
        } catch (error) {
            console.error(`Error with returning all vehicles:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    addVehicle: async (req, res) => {
        try {
            const { type, brand, model, buy_price, rent_price, img_url } = req.body; 

            const newVehicle = new Vehicle({
                type,
                brand,
                model,
                name: `${type} ${brand} ${model}`,
                buy_price,
                rent_price,
                img_url,
            });

            newVehicle.save();
            console.log(`\n\x1b[32mSuccessfully added new vehicle:\n\tType: ${type}\n\tBrand: ${brand}\n\tModel: ${model}\n\tName: ${`${type} ${brand} ${model}`}\n\tBuy price: ${buy_price}\n\tRent price: ${rent_price}\n\tImage URL: ${img_url}\n\x1b[0m\n`);
            res.redirect(`/admin`);
        } catch (error) {
            console.error(`Error with adding new vehicle:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteVehicle: async (req, res) => {
        const vehicleId = req.body.vehicleId;
        try {
            const vehicle = await Vehicle.findById(vehicleId);

            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            if (vehicle.rented_by) {
                const user = await User.findById(vehicle.rented_by);
                user.rentedVehicles.pull(vehicle._id);
                await user.save();
            }
            if (vehicle.bought_by) {
                const user = await User.findById(vehicle.bought_by);
                user.boughtVehicles.pull(vehicle._id);
                await user.save();
            }

            const deletedVehicle = await Vehicle.findOneAndDelete({ _id: vehicleId });
            if (deletedVehicle) {
                console.log(`\n\x1b[32m${deletedVehicle.name} has been deleted\x1b[0m\n`);
                res.redirect(`/admin`);
            } else {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
        } catch (error) {
            console.error(`Error with deleting vehicle:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    editVehicle: async (req, res) => {
        console.log(req.body);
        const { img_url, type, brand, model, vehicleId } = req.body;
        const rent_price = req.body.rent_price === '' ? null : Number(req.body.rent_price);
        const buy_price = req.body.buy_price === '' ? null : Number(req.body.buy_price);
        
        try {
            const updatedVehicle = await Vehicle.findOneAndUpdate(
                { _id: vehicleId },
                { $set: { 
                    type: type,
                    brand: brand,
                    model: model,
                    name: `${type} ${brand} ${model}`,
                    buy_price: buy_price,
                    rent_price: rent_price,
                    img_url: img_url,
                } },
                { new: true }
            );

            if (updatedVehicle) {
                console.log(`\n\x1b[32mVehicle ${updatedVehicle._id} has been updated:\n\tType: ${type}\n\tBrand: ${brand}\n\tModel: ${model}\n\tName: ${`${type} ${brand} ${model}`}\n\tBuy price: ${buy_price}\n\tRent price: ${rent_price}\n\tImage URL: ${img_url}\n\x1b[0m\n`);
                res.redirect(`/admin`);
            } else {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
        } catch (error) {
            console.error(`Error with updating vehicle:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

export default adminController;