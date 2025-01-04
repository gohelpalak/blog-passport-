
const mongoose=require('mongoose')

const blogschema=mongoose.Schema({
    title:String,
    desc:String,
    image:String,
    author:String,
    category:String
})
const Blog=mongoose.model('Blog',blogschema)
module.exports=Blog;
