const hostController = require('../controller/hostController');

const express = require('express');
const hostrouter = express.Router();

hostrouter.get('/host-shop', hostController.getHostShop);
hostrouter.get('/add-shop', hostController.getAddShop);
hostrouter.post('/add-shop', hostController.postAddShop);
hostrouter.get('/edit-shop/:shopId', hostController.getEditShop);
hostrouter.post('/edit-shop', hostController.postEditShop);
hostrouter.post('/delete-shop/:shopId', hostController.postDeleteShop);

module.exports = hostrouter;