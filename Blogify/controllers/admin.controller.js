const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req,res)=>{
    try{
        console.log(req.body);
        let admin = await User.findOne({email: req.body.email})
        if(admin){
            return res.json({ message:"Admin aleready registerd!!,Login Now" })
        }
        const hashpass= await bcrypt.hash(req.body.password,10);
        // req.body.role ='admin'
        admin= await User.create({...req.body,password: hashpass});
        return res.json({message:"Admin register!!!"});
    }catch(error){
        console.log(error);
        return res.json({message: "Server Error"});
    }
}

exports.loginAdmin = async(req,res)=>{
    try{
        let admin = await User.findOne({email: req.body.email});
        if(!admin){
            return res.status(404).json({message: "Admin  not Found"});

        }else{
            let checkPass = await bcrypt.compare(req.body.password,admin.password);
            if(checkPass){
                let token = jwt.sign({
                    userId: admin._id
                },process.env.SECREAT_KEY);
                return res.json({message: "Login Success",token})
            }else{
                return res.json({message: 'Password is not match..'});
            }
        }
    }catch(error){
        console.log(error);
        return res.json({message: "Server Error"});
    }
}

exports.profile = async(req,res)=>{
    try{
        return res.json({message: "Profile Found",user:req.user})

    }catch(error){
        console.log(error);
        return res.json({message: "Server Error"});
    }

}

exports.updateAdmin = async (req,res)=>{
    try {
        let findAdmin = await User.findById(req.params.id);
        if(findAdmin){
            let updateAdmin = await User.findByIdAndUpdate(req.params.id,req.body,{new: true});
            return res.status(200).json({message: "Admin update successfully",data: updateAdmin});
        }else{
            return res.status(400).json({ message: "Admin not found"});
        }
        
    }catch (error){
        console.log(error);
        return res.status(500).json({message: "Something went wrong"});
    }
};

exports.changepassword = async(req,res)=>{
    try{
        let checkpass = await bcrypt.compare(req.body.oldPassword, req.user.password)
        if(checkpass){
            let comaprepass = await bcrypt.compare(req.body.newPassword,req.user.password)
            if(comaprepass){
                return res.json({message: "Old pass & new pass both are same"});
            }else{
                if(req.body.newPassword === req.body.confiPass){
                    let hashPass = await bcrypt.hash(req.body.newPassword,10);
                    await User.findByIdAndUpdate(req.user._id,{password: hashPass},{new: true})
                    return res.json({message:"Password is updated"});
                }else{
                    return res.json({message: "New password & confirm password are not same.."});
                }
            }
            

        }else{
                return res.json({message:"old password is not matched"})
        }
    }catch(error){
        console.log(error);
        return res.json({message: "Server Error"});
    }
};