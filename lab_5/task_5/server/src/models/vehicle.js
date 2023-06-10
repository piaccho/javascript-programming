import mongoose from 'mongoose';
const { Schema } = mongoose;

const vehicleSchema = new Schema({
    vehicle_id: { type: Number, required: true },
    type: { type: String, enum: ['Hulajnoga', 'Rower wyścigowy', 'Rower górski'], required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    name: { type: String, required: true },
    buy_price: { type: Number, required: true },
    rent_price: { type: Number, required: true },
    img_url: { type: String, required: true },
    rent_by: { type: Schema.Types.ObjectId, ref: 'User' },
    bought_by: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
