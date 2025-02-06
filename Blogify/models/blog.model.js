const { timeStamp } = require('console');
const mongoose = require('mongoose');
const multer = require('multer');
const { type } = require('os');
const path = require('path');
const { title } = require('process');

const blogSchema = mongoose.Schema({
    blogImage:{
        type:String
    },
    title: {
        type:String,
        unique: true,
        require: true
    },
    description:{
        type:String,
        require:true
    },
    blogDate:{
        type:String,
        default:()=>new Date().toISOSString().split('T')[0]
    }
},{
    timeStamp:true
});

const blogStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,"..","uploads/blog"));
    },
    filename: (req,file,cb)=>{
        cb(null,`${file.fieldname}-${Date.now()}`);
    }
});

blogSchema.statics.uploadImage= multer({storage: blogStorage}).single('blogImage');
const blog = mongoose.model("blog",blogSchema);
module.exports = blog;