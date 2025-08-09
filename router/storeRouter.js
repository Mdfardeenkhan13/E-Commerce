const storeController = require('../controller/storeController');

const express = require('express');
const storeRouter = express.Router();

storeRouter.get('/', storeController.getHome);
storeRouter.get('/shop', storeController.getShop);
storeRouter.get('/about', storeController.getAbout);
storeRouter.get('/blog', storeController.getBlog);
storeRouter.get('/contact', storeController.getContact);
storeRouter.get('/cart', storeController.getCart);
storeRouter.post('/cart', storeController.postAddToCart);
storeRouter.post('/cart/delete/:shopId', storeController.postRemoveFromCart);

module.exports = storeRouter;