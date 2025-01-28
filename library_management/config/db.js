const mongoose = require('mongoose');

const dbConnect=()=>{
    mongoose.connect('mongodb+srv://gohelpalak14:palak%4022@cluster0.cjwxl.mongodb.net/library')
    .then(() => console.log('DB Connected!!'))
    .catch((err) => console.log(err));

}

module.exports = dbConnect();