const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const blogSchema = mongoose.Schema({
    blogImage: {
        type: String
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    blogDate: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    category: {
        type: String
    },
    author: {
        type: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment' // Reference to comment model
    }]
}, {
    timestamps: true
});

const blogStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads/blog"));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}`);
    }
});

blogSchema.statics.uploadImage = multer({ storage: blogStorage }).single('blogImage');
const blog = mongoose.model("blog", blogSchema);
module.exports = blog;