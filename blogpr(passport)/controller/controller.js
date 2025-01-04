const path = require('path')
const usermodels = require('../models/usermodels')
const fs = require('fs')
const Blog = require('../models/blogmodel')
const Ragistarpage = (req, res) => {
    return res.render('ragistar')
}
const loginpage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/viewblog');
    } else {
        return res.render('login');
    }
}
const Ragistarusers = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        await usermodels.create({
            name: name,
            email: email,
            password: password
        });
        return res.redirect('/')

    } catch (err) {
        console.log(err);
        return false
    }
}

const loginuseres = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await usermodels.findOne({ email: email })
        // console.log(user);

        if (!user || user.password !== password) {

            console.log(`Email and Password not valid`);
            return res.redirect('/')
        }
        res.cookie('auth', user);

        return res.redirect('/viewblog')
    } catch (error) {
        console.log(error);
        return false

    }
}

const addblogpage = async (req, res) => {
    return res.render('addblog')
}

const addblogusers = async (req, res) => {
    // let author = req.user.name;
    // req.body.author = author;
    try {
        const { title, desc, category } = req.body
        await Blog.create({
            title,
            desc,
            // author,
            category,
            image: req.file.path
        })
        return res.redirect('/viewblog')

    } catch (error) {
        console.log(error);
        return false

    }
}


const viewblog = async (req, res) => {
    try {

        // let users = await Blog.find({})

        const category = req.query.category;
        let allblog;
        if (category && category !== 'All') {
            allblog = await Blog.find({ category })
        }
        else {
            allblog = await Blog.find()
        }
        return res.render('viewblog', { users: allblog })


    } catch (error) {
        console.log(error);
        return false
    }
}

const deleterecord = async (req, res) => {
    try {
        // console.log(req.params.id);
        let id= req.params.id
        let single = await Blog.findById(id)
        fs.unlinkSync(single.image)
        await Blog.findByIdAndDelete(id)
        return res.redirect('/viewblog')
    } catch (error) {
        console.log(error);
    }
}

const editrecord = async (req, res) => {

    try {
        let id = req.query.id;
        let single = await Blog.findById(id);
        return res.render('editblog', {
            single
        })

    } catch (error) {
        console.log(error);
    }
}

const upblog = async (req, res) => {
    console.log(req.body);
    let singleRec = await Blog.findById(req.params.id);
    if(singleRec)
    {
        if(req.file)
        {
            let imagePath=singleRec.image;
            if(imagePath!="")
            {
                imagePath = path.join(__dirname, "..",imagePath);
                try{
                    fs.unlinkSync(imagePath);
                }catch(error)
                {
                    console.log("file not found");
                    
                }

            }
            let newImagepath=`/uploads/${req.file.filename}`;
            req.body.image=newImagepath;
        }
        else{
            req.body.image=singleRec.image;
        }
        await Blog.findByIdAndUpdate(req.params.id,req.body,{
            new:true,});
            console.log("record updated");
            return res.redirect('/viewblog');   
    }
    else{
        console.log("record not found");
        return res.redirect('back');
    }
}





    // try {
        // const { id } = req.params.id;
        // let id=req.params.id
        // let singleRec = await Blog.findById(req.params.id);
        // if (record) {
        //     if (req.file) {
        //         let imagePath=record.image
        //         try {
        //             imagePath = path.join(__dirname, singleRec.image);
        //             fs.unlinkSync(imagePath);
        //         } catch (error) {
        //             console.log("File not Found.....");
        //         }
        //         imagePath = `/uploads/${req.file.filename}`;
        //         req.body.image = imagePath;
        //         await Blog.findByIdAndUpdate(id, req.body)
        //     } else {
        //         await Blog.findByIdAndUpdate(id, req.body)
        //     }
        // }
        // else {
        //     console.log("record not found");

        // }

        // return res.redirect('/viewblog');
        // const { editid, title, desc } = req.body
        // if (req.file) {
        //     let single = await Blog.findById(editid)
        //     fs.unlinkSync(single.image)

        //     await Blog.findByIdAndUpdate(editid, {
        //         title, desc,
        //         image: req.file.path
        //     })
        //     return res.redirect('/viewblog')
        // } else {
        //     let single = await Blog.findById(editid)

        //     await Blog.findByIdAndUpdate(editid, {
        //         title, desc,
        //         image: single.image
        //     })
        //     return res.redirect('/viewblog')
        // }
    // } catch (error) {
        // console.log(error);
    // }


const viewSingleBlog = async (req, res) => {
    // console.log(req.params.id);
    let record = await Blog.findById(req.params.id);
    console.log(record,);
    if (record) {
        return res.render('viewSingle', { record })
    }
    else {
        console.log("something wrong");

    }


}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        }
        return res.redirect('/');
    });
}



module.exports = {
    Ragistarpage, loginpage, Ragistarusers, loginuseres,
    addblogpage, addblogusers, viewblog, deleterecord, editrecord, upblog, logout, viewSingleBlog
}