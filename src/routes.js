const express = require('express');

const urlController = require('./controllers/urlController');
const userController = require('./controllers/userController');

const routes = express.Router();

routes.get('/:urlName', urlController.redirectUrl);
routes.post('/user/:userId', urlController.create);
routes.delete('/delete/:userId/:urlName', urlController.delete);

routes.post('/create/user', userController.create);
routes.get('/user/:userId', userController.list);
routes.get('/user/:userId/:category', userController.listByCategory);

module.exports = routes;