const user = require('../model/user.model');
const blog = require('../model/blog.model');
const comment = require('../model/comment.model')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.register =  async (req, res) => {
    try {
        let findUser = await user.findOne({ email: req.body.email });
        if (findUser) {
            return res.status(400).json({ message: "User already Exist!!! Please Login" });
        } else {
            let hashPassword = await bcrypt.hash(req.body.password, 10);
            console.log(hashPassword);
            req.body.role = 'user'
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

exports.updateUser =  async (req, res) => {
    try {
        let findUser = await user.findById(req.params.id);
        if (findUser) {
            if (req.file) {
                let imagePath = findUser.blogImage;
                if (imagePath != "" && imagePath) {
                    imagePath = path.join(__dirname, "..", imagePath);
                    try {
                        fs.unlinkSync(imagePath);
                    } catch (error) {
                        return res.status(404).res.json({ message: "File Missing...." })
                    }
                }
                req.body.blogImage = `/uploads/blog/${req.file.filename}`;
            }
            else {
                req.body.blogImage = findUser.blogImage
            }
            let updateUser = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({ message: "User updated successfully", data: updateUser });
        } else {
            return res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

exports.deleteUser =async (req, res) => {
    try {
        let findUser = await user.findById(req.params.id);
        if (findUser) {
            let deleteUser = await user.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "User deleted successfully", data: deleteUser });
        } else {
            return res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// =============== Blog ==================

 exports.getAllBlogs =  async (req, res) => {
    try {
        let allBlogs = await blog.find();
        return res.status(200).json({ message: "Blogs fetched successfully", allBlogs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

exports.getSingleBlog = async (req, res) => {
    try {
        let singleBlog = await blog.findById(req.params.id).populate('comments');
        if (!singleBlog) {
            return res.status(404).json({ message: "Blog not Found!!!" });
        }

        return res.status(200).json({ message: "Blog fetched successfully", blog: singleBlog });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.addComment = async (req, res) => {
    try {
        let findBlog = await blog.findById(req.params.id);
        req.body.userId = req.user._id;
        req.body.blogId = req.params.id;
        if (findBlog) {
            let addComment = await comment.create(req.body);
            findBlog.comments.push(addComment._id);
            await findBlog.save();

            return res.status(200).json({ message: "Comment added successfully", data: addComment });
        } else {
            return res.status(400).json({ message: "Blog Not Found!!" });
        }
    } catch (error) {
        console.error("Error adding blog:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

// exports.deleteBlog =  async (req, res) => {
    //     try {
    //         let findBlog = await blog.findById(req.params.id);
    //         if (findBlog) {
    //             let deleteBlog = await blog.findByIdAndDelete(req.params.id);
    //             return res.status(200).json({ message: "Blog deleted successfully", data: deleteBlog });
    //         } else {
    //             return res.status(400).json({ message: "Blog not found" });
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

// exports.updateBlog =  async (req, res) => {
    //     try {
    //         let findBlog = await blog.findById(req.params.id);
    //         if (findBlog) {
    //             let updateBlog = await blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    //             return res.status(200).json({ message: "Blog updated successfully", data: updateBlog });
    //         } else {
    //             return res.status(400).json({ message: "Blog not found" });
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ message: "Something went wrong" });
    //     }
    // }