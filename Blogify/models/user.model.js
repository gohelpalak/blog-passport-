const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type:String
    },
    mobileNo:{
        type:String
    },
    role: {
        type: String,
        enum: ['admin', 'user']
    },
},
{
    timestamps: true
});

const User = mongoose.model("user",userSchema);

module.exports = User;