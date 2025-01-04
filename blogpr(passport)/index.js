const express=require('express');
let path=require('path');
const port=1000;
const db = require('./config/db');
const mongoose = require("mongoose");
const cookieParser=require('cookie-parser');
const session=require('express-session');
const passport=require('passport');
const localSt=require('./config/passportLocalStratergy');

const app=express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'/public')));
app.use(session({
    name: 'learning',
    secret:"learning",
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:5000*60*60*60*60,
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setLocalUser);

app.use('/',require('./routes/indexroutes'))
app.use('/uploads',express.static(path.join(__dirname,'uploads')));


app.listen(port,(err)=>{
    if (err) {
        console.log(err);
    }
    console.log(`server is runing http://localhost:${port}`);
})