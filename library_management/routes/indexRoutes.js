const express = require('express');

const routes = express.Router();

routes.use('/', require('../routes/authRoutes'));
routes.use('/category', require('../routes/categoryRoutes'));
routes.use('/subcategory', require('../routes/subcategoryRoutes'));
routes.use('/book', require('./bookRoutes'));

module.exports = routes;