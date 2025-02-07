const user = require('../model/user.model');
const blog = require('../model/blog.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

exports.register = async (req, res) => {
    try {
        let findUser = await user.findOne({ email: req.body.email });
        if (findUser) {
            return res.status(400).json({ message: "User already Exist!!! Please Login" });
        } else {
            let imagePath = "";
            if (req.file) {
                imagePath = `/uploads/admin/${req.file.filename}`;
            }
            req.body.adminImage = imagePath;

            let hashPassword = await bcrypt.hash(req.body.password, 10);
            console.log(hashPassword);
            req.body.role = 'admin'
            let addUser = await user.create({ ...req.body, password: hashPassword });
            return res.status(201).json({ message: "User Register Success", user: addUser });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.login = async (req, res) => {
    try {
        let findUser = await user.findOne({ email: req.body.email });
        console.log(user);
        if (!findUser) {
            return res.status(404).json({ message: "User not Found" });
        }
        let checkedPass = await bcrypt.compare(req.body.password, findUser.password)
        console.log(checkedPass);
        if (checkedPass) {
            let token = jwt.sign({
                userId: findUser._id
            }, 'secret');
            return res.status(200).json({ message: "Login Success", token });
        } else {
            return res.status(400).json({ message: "Password is Not Matched!!" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.profile = (req, res) => {
    try {
        return res.json({ message: "Profile Found", user: req.user })
    } catch (error) {
        console.log(error);
        return res.json({ message: "Server Error" });
    }
}

exports.updateAdmin =async (req, res) => {
    try {
        let findAdmin = await user.findById(req.params.id);
        if (findAdmin) {
            if (req.file) {  // This checks if the user uploaded a new image.
                let imagePath = findAdmin.adminImage;  // Stores the old admin image path (if there is one).
                if (imagePath != "" && imagePath) { // Checks if an old image exists. If yes, it will try to delete it.
                    imagePath = path.join(__dirname, "..", imagePath);
                    try {
                        fs.unlinkSync(imagePath);
                    } catch (error) {
                        return res.status(404).res.json({ message: "File Missing...." })
                    }
                }
                req.body.adminImage = `/uploads/admin/${req.file.filename}`; //Saves the new image path in req.body.adminImage
            }
            else {
                req.body.adminImage = findAdmin.adminImage
            }
            let updateAdmin = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({ message: "Admin updated successfully", data: updateAdmin });
        }
        else {
            return res.status(400).json({ message: "Admin not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

exports.deleteAdmin = async (req, res) => {
    try {
        let findAdmin = await user.findById(req.params.id);
        if (findAdmin) {
            if (findAdmin.adminImage) {
                let imagePath = path.join(__dirname, "..", findAdmin.adminImage);
                fs.unlinkSync(imagePath);
            }
            let deleteAdmin = await user.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Admin deleted successfully", data: deleteAdmin });
        } else {
            return res.status(400).json({ message: "Admin not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// ========================= addBlog ====================

exports.addBlog = async (req, res) => {
    try {
        let findSameBlog = await blog.findOne({ title: req.body.title });
        if (!findSameBlog) {
            let imagePath = "";
            if (req.file) {
                imagePath = `/uploads/blog/${req.file.filename}`;
            }
            req.body.blogImage = imagePath;
            req.body.author = req.user.username;

            let addBlog = await blog.create(req.body);
            return res.status(200).json({ message: "Blog added successfully", data: addBlog });
        } else {
            return res.status(400).json({ message: "Blog already exist" });
        }
    } catch (error) {
        console.error("Error adding blog:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

exports.getAllBlogs = async (req, res) => {
    try {
        let allBlogs = await blog.find();
        return res.status(200).json({ message: "Blogs fetched successfully", allBlogs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

exports.getSingleBlog =  async (req, res) => {
    try {
        let singleBlog = await blog.findById(req.params.id);
        if (!singleBlog) {
            return res.status(404).json({ message: "Blog not Found!!!" });
        }
        return res.status(200).json({ message: "Blog fetched successfully", blog: singleBlog });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.updateBlog =  async (req, res) => {
    try {
        let findBlog = await blog.findById(req.params.id);
        if (findBlog) {
            if (req.file) {
                let imagePath = findBlog.blogImage;
                if (imagePath != "" && imagePath) {
                    imagePath = path.join(__dirname, "..", imagePath);
                    try {
                        fs.unlinkSync(imagePath);
                    } catch (error) {
                        return res.status(404).res.json({ message: "File Missing...." })
                    }
                }
                req.body.blogImage = `/uploads/blog/${req.file.filename}`;
            } else {
                req.body.blogImage = findBlog.blogImage
            }
            let updateBlog = await blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({ message: "Blog updated successfully", data: updateBlog });
        } else {
            return res.status(400).json({ message: "Blog not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        let findBlog = await blog.findById(req.params.id);
        if (findBlog) {
            if (findBlog.blogImage) {
                let imagePath = path.join(__dirname, "..", findBlog.blogImage);
                fs.unlinkSync(imagePath);
            }
            let deleteBlog = await blog.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Blog deleted successfully", data: deleteBlog });
        } else {
            return res.status(400).json({ message: "Blog not found" });
        }
    } catch (error) {
        console.log(error);
    }
}