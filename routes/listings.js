const mongoose=require("mongoose")
const Listing=require("../models/listing.js");
const express=require("express")
const multer=require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage })
 

const router=express.Router()
const { islogedin } = require("../middleware.js");


router.get("/",async(req,res)=>{
    let listings= await Listing.find()
    res.render("listing/index.ejs",{listings})
})

router.route("/new").get((req,res)=>{
    res.render("listing/newListing.ejs")
}).post(islogedin,upload.single("image"),async(req,res)=>{
    let {title,disclaimer,price,location,country}=req.body
    let urll=req.file.path;
    let filenamee=req.file.filename;
    console.log(req.file)
    let newListing= new Listing({
        title: title,
        description : disclaimer,
        image:{
          filename: filenamee,
          url:urll
        },
        price : price,
        location : location,
        country : country
    })
    newListing.owner=req.user._id
    await newListing.save().then((res)=>{
        console.log(res)
    })
    req.flash("success","new listing created ")
    res.redirect("/listings")
})
router.post("/:id",async(req,res)=>{
let {id}=req.params;
const listing=await Listing.findByIdAndDelete(id)

req.flash("success","Listing deleted")
res.redirect("/listings")

})

router.get("/:id/show",async(req,res)=>{
    let {id}=req.params;
    let shows=await Listing.findById(id).populate("owner").populate("reviews")
if(!shows){
    req.flash("error","listing you request does not exist !")
    res.redirect("/listings")
}
    res.render("listing/show.ejs",{shows})
})

router.get("/:id/edit",islogedin,async(req,res)=>{
    let {id}=req.params;
    let edit=await Listing.findById(id)
    res.render("listing/edit.ejs",{edit})
})

router.put("/:id",upload.single("image"),async(req,res)=>{
    let {id}=req.params;
    let update;
    let {title,description,price,location,country}=req.body
    if(typeof req.file !=="undefined"){
        let filenamee=req.file.filename
        let urll=req.file.path
        update= await Listing.findByIdAndUpdate(id,{
         title: title,
         description: description,
         image : {
            filename : filenamee,
            url:urll
         },
         price : price,
         location : location,
         country : country
        },
        { new: true }
    )
        
    }
    req.flash("success","Listing edited ")
    res.redirect("/listings")
})

module.exports=router;