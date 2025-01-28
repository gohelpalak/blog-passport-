const mongoose = require("mongoose");
const multer = require('multer')
const path=require('path')

const bookSchema = mongoose.Schema({
  categoryid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  subcategoryid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
  },
  
  name: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  image: {
    type: String,
    require: true
  },
  status: {
    type: String,
    default: "active",
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads"))
  },
  filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + Date.now() )
  }
});
 bookSchema.statics.uploadImage = multer({ storage: storage }).single('image')

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;