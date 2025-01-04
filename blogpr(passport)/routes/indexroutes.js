const express = require('express');
const routes = express.Router(); 
// const  admin = require('./models/adminModel');
// const blog = require('./models/view')
const { loginpage, Ragistarpage, Ragistarusers, loginuseres,   addblogpage, addblogusers, viewblog, deleterecord, editrecord, upblog,logout, viewSingleBlog } = require('../controller/controller');
const passport = require('passport');

const multer=require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage }).single('image')

routes.get('/', loginpage);
routes.get('/register',Ragistarpage); 
routes.post('/insert',Ragistarusers)
routes.post('/login',passport.authenticate('local',{failureRedirect:'/'}), loginuseres)
routes.get('/addblogpage',passport.validateUser,addblogpage); 
routes.post('/addblog',upload,addblogusers)
routes.get('/viewblog', passport.validateUser ,viewblog); 
routes.get('/delete/:id',deleterecord); 
routes.get('/edit',passport.validateUser,editrecord); 
routes.get("/view:id",viewSingleBlog)
routes.post('/up/:id',upload,upblog);
routes.get('/logout',logout); 


module.exports = routes;