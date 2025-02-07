const express = require('express');
const userRoutes = express.Router();
const user = require('../model/user.model');
const blog = require('../model/blog.model');
const comment = require('../model/comment.model')

const { verifyToken } = require('../middleware/verifyToken');
const { register, login, profile, updateUser, deleteUser, getAllBlogs, getSingleBlog, addComment } = require('../controller/user.controller');

//----------USER AUTHENTICATION--------------
userRoutes.post("/register",register);

userRoutes.post("/login", login);

userRoutes.get("/profile", verifyToken, profile);

userRoutes.put('/updateUser/:id', verifyToken, updateUser);

userRoutes.delete('/deleteUser/:id', verifyToken, deleteUser);

// blog 

userRoutes.get('/getAllBlogs',getAllBlogs);

userRoutes.get('/getSingleBlog/:id', verifyToken, getSingleBlog);

userRoutes.post('/addComment/:id', verifyToken, addComment);

// adminRoutes.delete('/deleteBlog/:id',deleteBlog);

// adminRoutes.put('/updateBlog/:id',updateBlog);

module.exports = userRoutes;
