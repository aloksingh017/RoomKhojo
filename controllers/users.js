const User = require('../models/user')

module.exports.renderRegisterForm = (req,res)=>{
    res.render('user/register')
}
module.exports.register = async(req,res)=>{
    try{
        const {email,username,password}= req.body
        const user = new User({email,username});
        const registeredUser = await User.register(user,password)
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','welcome to ROOMKHOJO')
            res.redirect('/rooms')
        })
    } catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}
module.exports.renderLoginForm =  (req,res)=>{
    res.render('user/login')
}
module.exports.login = (req,res)=>{
    req.flash('success', "Welcome Back")
    const redirectUrl = req.session.returnTo || '/rooms'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}
module.exports.logout = (req,res)=>{
    req.logout()
    req.flash('success','GOODBYE')
    res.redirect('/rooms')
}