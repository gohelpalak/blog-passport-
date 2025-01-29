const BookModel=require('../models/bookmodel')

exports.viewAllBook=async(req,res)=>{
    const book = await BookModel.find({});

    res.render('userPage',{book});
}
