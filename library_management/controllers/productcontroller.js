const categoryModel = require('../models/categorymodel');
const subcategoryModel = require('../models/subcategorymodel');
const productModel = require('../models/productmodel');
const fs = require('fs')

const viewProductPage = async (req, res) => {
    try {
        const product = await productModel.find({}).populate('categoryid').populate('subcategoryid').populate('exsubcategoryid');

        return res.render('product/viewproduct', {
            product
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

const addProduct = async (req, res) => {
    try {
        let category = await categoryModel.find({ status: "active" });
        let subcategory = await subcategoryModel.find({ status: "active" });
        
        return res.render('product/addproduct', {
            category,
            subcategory,
           
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

const addProductDetailPage = async (req, res) => {
    try {
        const { category, subcategory, name, price, description } = req.body;

        await productModel.create({
            categoryid: category,
            subcategoryid: subcategory,
            name: name,
            price: price,
            description: description,
            image: req.file.path
        })
        return res.redirect("/product/addproduct");
    } catch (err) {
        console.log(err);
        return false;
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.query.id

        let single = await productModel.findById(id);
        fs.unlinkSync(single.image);

        await productModel.findByIdAndDelete(id);
        return res.redirect("/product/viewproduct");
    } catch (err) {
        console.log(err);
        return false;
    }
}

const editProduct = async (req, res) => {
    try {
        const id = req.query.id;

        const category = await categoryModel.find({});
        const subcategory = await subcategoryModel.find({})
        const product = await productModel.findById(id).populate('categoryid').populate('subcategoryid').populate('exsubcategoryid');
        return res.render('product/editproduct', {
            category,
            subcategory,
           
            product
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

const updateProductDetail = async (req, res) => {
    try {
        const { category, subcategory, name, price, description,editid} = req.body;
        console.log(editid);
        
        if (req.file) {
            const single = await productModel.findById(editid);

            fs.unlinkSync(single.image);
            await productModel.findByIdAndUpdate(editid, {
                categoryid: category,
                subcategoryid: subcategory,
               
                name: name,
                description: description,
                price: price,
                image: req.file.path
            });
            return res.redirect("/product/viewproduct");
        } else {
            const single = await productModel.findById(editid);

            await productModel.findByIdAndUpdate(editid, {
                categoryid: category,
                subcategoryid: subcategory,
                
                name: name,
                description: description,
                price: price,
                image : single.image
            });
            return res.redirect("/product/viewproduct");
        }
    } catch (err) {
        console.log(err);
    }
};


const ajaxcatfetch = async(req,res) =>{
    try {

        const id=req.query.id    
        const subcategory=await subcategoryModel.find({categoryid:id, status: 'active'})    
        return res.send({
            success:true,
            message:'ajax is working',
            subcategory
        })

    } catch (error) {
        console.log(error);
        return false
    }
}
const ajaxsubcatfetch = async(req,res) =>{
    try {

        const id=req.query.id    
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
    addProduct, viewProductPage, addProductDetailPage, deleteProduct, editProduct, updateProductDetail,ajaxsubcatfetch,ajaxcatfetch
}