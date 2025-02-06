require('dotenv').config();

const express = require('express');
const app= express();
const morgan = require('morgan');
const db = require('./config/dbconnection');

app.use(morgan('dev'))
app.use(express.urlencoded());

app.use("/",require("./routes/index.routes"))

app.listen(process.env.PORT,()=>{
    console.log(`Server start at http://localhost:${process.env.PORT}`);
})