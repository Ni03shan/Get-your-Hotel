if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express=require("express")
const app=express()
const path=require("path")
const ejsMate=require("ejs-mate")
const methodOverride = require('method-override');
const reviewSchema= require("./schema.js")
const cookieParseer=require("cookie-parser")
const mongoose=require("mongoose")
const expressSession=require("express-session")
const flash =require("connect-flash")
const passport=require("passport")
const localStrategy=require("passport-local")
const User=require("./models/user.js")
const Listings=require("./models/listing.js")
let Listing=require("./routes/listings.js")
const Review = require("./models/review.js");
const userRouter=require("./routes/user.js")
const {islogedin}=require("./middleware.js")

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,'public')));


app.use(expressSession({secret:"secretid",resave:false,saveUninitialized:true,cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
}}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  res.locals.curUser=req.user
  next();
})

app.use("/listings",Listing)
app.use("/",userRouter)

app.get("/",(req,res)=>{
    res.redirect("/listings")
})

app.post("/listings/:id/review",islogedin,async(req,res)=>{
    if(!islogedin){
        res.redirect("/login")
    }
    let listing =await Listings.findById(req.params.id).populate("reviews") ;
     
    let newreview=new Review(req.body.review);

    listing.reviews.push(newreview)

    let newReview= await newreview.save()
    await listing.save()

    res.render("listing/show.ejs",{shows: listing})

})

main().then(()=>console.log("connected !")).catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(process.env.MONGO_URL)
}
app.listen(4000,()=>{
    console.log("ok!")
})

