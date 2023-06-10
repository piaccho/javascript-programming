import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    user_id: { type: Number, required: true },
    type: { type: String, enum: ['admin', 'customer'], required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    login: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
