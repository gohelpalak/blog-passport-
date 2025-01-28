const express=require('express');
const userRoutes=express.Router();

userRoutes.get('/',(req,res)=>{
    res.render('userPage');
})
module.exports=userRoutes