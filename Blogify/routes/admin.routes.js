const express= require("express");
const { registerAdmin, loginAdmin, profile, changepassword, updateAdmin } = require("../controllers/admin.controller");
const { verifyToken } = require("../middleware/verifyToken");

const routes = express.Router();

routes.post("/register",registerAdmin);
routes.post("/login",loginAdmin);
routes.get("/profile",verifyToken,profile);
routes.put("/updateAdmin/:id",verifyToken,updateAdmin)
routes.put("/change-password",verifyToken,changepassword)

module.exports = routes;