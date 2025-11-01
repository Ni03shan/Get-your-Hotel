module.exports.islogedin=(req,res,next)=>{
   if(!req.isAuthenticated()){
        req.flash("error",'you must loged in !')
        return res.redirect("/login")
    }
    next()
}