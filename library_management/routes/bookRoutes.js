const express = require('express');
const path = require('path')
const fs = require('fs')

const passport = require("passport");

const { addBook, viewBookPage, addBookDetailPage, deleteBook, editBook, updateBookDetail, ajaxsubcatfetch, ajaxcatfetch } = require('../controllers/Bookcontroller');

const routes = express.Router();

const multer = require('multer');
const Book = require('../models/bookmodel');



// Routes
routes.get('/addBook', passport.checkUser, addBook);
routes.get('/viewBook', passport.checkUser, viewBookPage);
routes.post('/addBookdetail', Book.uploadImage, addBookDetailPage);
routes.get('/deleteBook/:id', deleteBook);
routes.get('/editeBook', passport.checkUser, editBook);
routes.post('/updateBookdetail/:id', Book.uploadImage, updateBookDetail)

routes.get('/ajaxcatfetch', ajaxcatfetch)
routes.get('/ajaxsubcatfetch', ajaxsubcatfetch)

module.exports = routes