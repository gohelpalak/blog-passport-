const mongoose=require('mongoose')

mongoose.connect('mongodb+srv://gohelpalak14:palak%4022@cluster0.cjwxl.mongodb.net/blogpassport')
// mongoose.connect('mongodb://localhost:27017/blogpass')
const database=mongoose.connection

database.on("connected",(err)=>{
    if (err) {
        console.log(err);
        return false   
    }
    console.log("db is connected");
})
 

module.exports=database