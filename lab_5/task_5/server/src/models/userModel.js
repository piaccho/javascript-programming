import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    type: { type: String, enum: ['user', 'customer'], required: true, default: 'customer'},
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    rentedVehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle', default: [] }],
    boughtVehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle', default: [] }],
});

const User = mongoose.model('User', userSchema);

export default User
