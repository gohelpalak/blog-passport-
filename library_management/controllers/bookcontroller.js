const categoryModel = require('../models/categorymodel');
const subcategoryModel = require('../models/subcategorymodel');
const BookModel = require('../models/bookmodel');
const fs = require('fs')
const path = require('path');
const { log } = require('console');

const viewBookPage = async (req, res) => {
    try {
        const book = await BookModel.find({}).populate('categoryid').populate('subcategoryid');

        return res.render('Book/viewBook', {
            book
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

const addBook = async (req, res) => {
    try {
        let category = await categoryModel.find({ status: "active" });
        let subcategory = await subcategoryModel.find({ status: "active" });

        return res.render('Book/addBook', {
            category,
            subcategory,

        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

const addBookDetailPage = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }
        req.body.image = imagePath;
        const book = await BookModel.create(req.body);
        if (book) {
            return res.redirect("/admin/Book/viewBook");
        }
        // const { category, subcategory, name, price, description } = req.body;
        // // req.body.image = imagePath;

        // await BookModel.create({
        //     categoryid: category,
        //     subcategoryid: subcategory,
        //     name: name,
        //     price: price,
        //     description: description,
        //     image: imagePath
        // })
        // return res.redirect("/admin/Book/addBook");
    } catch (err) {
        console.log(err);
        return false;
    }
}

const deleteBook = async (req, res) => {
    try {
        let single = await BookModel.findById(req.params.id);
        if (single) {
            if (single.image) {
                let imagepath = path.join(__dirname, "..", single.image)
                try {
                    await fs.unlinkSync(imagepath);

                } catch (err) {
                    console.log(err);
                }
            }
            await BookModel.findByIdAndDelete(single);
            return res.redirect("/admin/Book/viewBook");

        }



    } catch (err) {
        console.log(err);
        return false;
    }
}

const editBook = async (req, res) => {
    try {
        const id = req.query.id;

        const category = await categoryModel.find({});
        const subcategory = await subcategoryModel.find({})
        const Book = await BookModel.findById(id).populate('categoryid').populate('subcategoryid');
        return res.render('Book/editBook', {
            category,
            subcategory,

            Book
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

const updateBookDetail = async (req, res) => {
    try {
        let record = await BookModel.findById(req.params.id);
        if (record) {
            if (req.file) {
                let imagepath = path.join(__dirname, "..", record.image)
                try {
                    fs.unlinkSync(imagepath);
                } catch (err) {
                    console.log(err);
                }
                let newimagePath = `/uploads/${req.file.filename}`;
                req.body.image = newimagePath;
            }
            await BookModel.findByIdAndUpdate(req.params.id, req.body);
            return res.redirect("/admin/Book/viewBook");
        }
        else {
            console.log("something wrong");
            return res.redirect("/admin/Book/viewBook");
        }

    } catch (err) {
        console.log(err);
    }
};


const ajaxcatfetch = async (req, res) => {
    try {

        const id = req.query.id
        const subcategory = await subcategoryModel.find({ categoryid: id, status: 'active' })
        return res.send({
            success: true,
            message: 'ajax is working',
            subcategory
        })

    } catch (error) {
        console.log(error);
        return false
    }
}
const ajaxsubcatfetch = async (req, res) => {
    try {

        const id = req.query.id
        // const exsubcategory=await exsubcategoryModel.find({subcategoryid:id, status: 'active'})    
        // return res.send({
        //     success:true,
        //     message:'ajax is working',
        //     exsubcategory
        // })

    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = {
    addBook, viewBookPage, addBookDetailPage, deleteBook, editBook, updateBookDetail, ajaxsubcatfetch, ajaxcatfetch
}