const passport = require("passport");

const  localStrategy = require('passport-local').Strategy;
const Admin = require("../models/usermodels");

passport.use(new localStrategy({usernameField: 'email'},
    async (email,password,done)=>{
        
        try{
            let loginAdmin = await Admin.findOne({email: email});
            console.log(loginAdmin,".................");
            
        if(loginAdmin){
            if(loginAdmin.password === password){
                done(null,loginAdmin);
            }else{
                done(null,false);
            }
        }else{
            done(null,false);
        }
    }catch(error){
        console.log(error);
        return done(error,false);
    }
}));

passport.serializeUser((admin,cb)=>{
    return cb(null, admin.id)
})

passport.deserializeUser(async (id,cb)=>{
    let user = await Admin.findById(id);
    cb(null,user);
});

passport.validateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect("/");
    }
}

passport.setLocalUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.admin = req.user;
    }
    next();
}

module.exports = passport;