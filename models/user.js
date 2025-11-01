const { required } = require("joi");
const mongoose=require("mongoose")
const Schema=mongoose.Schema

const passportLocalMongoose=require("passport-local-mongoose");

const useSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
})

useSchema.plugin(passportLocalMongoose)

module.exports=mongoose.model("User",useSchema)