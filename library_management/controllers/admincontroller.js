adminmodel = require('../models/adminmodel');

const nodemailer = require('nodemailer')

const loginPage = (req, res) => {
    if (res.locals.users) {
        return res.redirect("/admin/dashboard");
    }
    return res.render('login');
}
const Register = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/admin/dashboard");
    } else {
        return res.render("register");
    }
}
const loginUser = async (req, res) => {
    return res.redirect('/admin/dashboard')
}
const registerUser = async (req, res) => {
    try {
        // console.log(req.body);

        const { name, email, password } = req.body;
        let users = await adminmodel.create({
            name: name,
            email: email,
            password: password,
        })
        return res.redirect('/admin')
    } catch (err) {
        console.log(err);
        return false;
    }
}
const dashBoard = (req, res) => {
    return res.render('dashboard');
}

const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return false;
        }
        return res.redirect('/admin');
    });
}

const forgotPassword = (req, res) => {
    return res.render('forgotpage');
}

const submitEmail = async (req, res) => {
    try {
        const email = req.body.useremail;
        const user = await adminmodel.findOne({ email: email })
        if (!user) {
            return res.redirect('/admin');
        }
        const otp = Math.floor(Math.random() * 100000)

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gohelpalak14@gmail.com',
                pass: 'wtil ohff afqf mvnb'
            }
        });

        var mailOptions = {
            from: 'gohelpalak14@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            html: `your otp is:${otp}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {

                console.log('Email sent: ' + info.response);
                let obj = {
                    otp: otp,
                    email: email
                }
                res.cookie('otp', obj);

                return res.redirect('/otp')
            }
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

const otpPage = (req, res) => {
    return res.render('otp')
}

const submitotp = (req, res) => {
    const otp = req.body.userotp
    console.log(otp);

    const uotp = req.cookies.otp.otp
    console.log(uotp);


    if (otp == uotp) {
        return res.redirect('/setnewpass')
    } else {
        console.log("OTP is not vaild");
        return false
    }
}

const setnewPass = (req, res) => {
    return res.render('setnewpass')
}

const newPass = async (req, res) => {
    try {
        const { newpass, confirmpass } = req.body;
        if (newpass == confirmpass) {
            const useremail = req.cookies.otp?.email
            await adminmodel.findOneAndUpdate({ email: useremail }, {
                password: newpass
            })
            return res.redirect('/admin')
        } else {
            console.log('newpassword and confirm password does not match');
            return res.redirect('/setnewpass')
        }

    } catch (err) {
        console.log(err);
        return false;
    }
}

// change password

const changepasspage = (req, res) => {
    return res.render('changepass')
}

const changepass = async (req, res) => {
    try {
        const { oldpass, confirmpass } = req.body;
        const email = res.locals.users.email

        if (oldpass == res.locals.users.password) {
            await adminmodel.findOneAndUpdate({ email: email }, {
                password: confirmpass
            })
            return res.redirect('/admin')
        } else {
            console.log('newpassword and confirm password does not match');
            return res.redirect('/changepass')
        }

    } catch (err) {
        console.log(err);
        return false;
    }
}

const viewprofilePage = (req, res) => {
    return res.render('viewprofile')
}

const editProfilePage = (req, res) => {
    return res.render('editprofile')
}

const updateProfile = async (req, res) => {
    try {
        const { name, editpassword, editemail } = req.body
        await adminmodel.findOneAndUpdate({ email: editemail }, {
            name: name,
            password: editpassword,

        })
        return res.redirect('/viewprofile')
    } catch (err) {
        console.log(err);
        return false
    }
}
module.exports = {
    loginPage, loginUser, Register, registerUser, dashBoard, forgotPassword, logout, submitEmail, newPass, otpPage, submitotp, setnewPass, changepasspage, changepass, viewprofilePage, editProfilePage,
    updateProfile
}