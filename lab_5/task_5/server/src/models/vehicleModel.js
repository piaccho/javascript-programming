import mongoose from 'mongoose';
const { Schema } = mongoose;

const vehicleSchema = new Schema({
    type: { type: String, enum: ['Hulajnoga', 'Rower wyścigowy', 'Rower górski'], required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    name: { type: String, required: true },
    buy_price: { type: Number },
    rent_price: { type: Number },
    img_url: { type: String, required: true },
    rented_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    bought_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
