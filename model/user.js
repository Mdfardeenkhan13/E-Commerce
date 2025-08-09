const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"]
    },
    lastName: String,
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    userType: {
        type: String,
        enum: ['guest', 'host'],
        default: 'guest'
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }]
})

module.exports = mongoose.model('User', userSchema);