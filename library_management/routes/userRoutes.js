const express=require('express');
const users = require('../models/adminmodel');
const userRoutes=express.Router();  
const BookModel=require('../models/bookmodel');
const { viewAllBook } = require('../controllers/usercontroller');

userRoutes.get('/',viewAllBook)

module.exports=userRoutes