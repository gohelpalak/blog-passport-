const express = require("express");
const routes =express.Router();

routes.use("/admin",require('./admin.routes'));
// routes.use("/user",require("./user.routes"));

module.exports = routes;