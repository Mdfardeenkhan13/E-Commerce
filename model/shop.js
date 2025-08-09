const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    productPhoto: String,
    description: String,
})

// shopSchema.pre('findOneAndDelete', async function (next) {
//     const shopId = this.getQuery()._id;
//     await cart.deleteMany({shopId: shopId})
//     next();
// })

module.exports = mongoose.model('Shop', shopSchema);