import asynchandler from "../utils/Asynchandler.js";

import APIError from "../utils/APIerror.js";
import {User} from "../models/user.model.js";
import uploadcloudinary from "../utils/cloudinary.js";
import Apiresposnse from "../utils/Apiresponse.js";

const registerUser = asynchandler(async (req, res) => {
   
     const {username,fullname,password,email}=req.body;

     if([username,fullname,password,email].some((feilds)=>feilds?.trim()==="")){
        throw new APIError(400,"all fields are required")
     };
     const ExistedUser=await User.findOne(
      {
        $or:[{email},{username}]
      }
     )
     if(ExistedUser){
       throw new APIError(409,"user with email or username is exist") 
     }
     const avatarlocalpath=await req.files?.avatar[0]?.path;
     const coverimagelocalpath= await req.files?.coverimage[0]?.path;
    // console.log("avatar",req.files)

     if(!avatarlocalpath)
     {
      throw new APIError(400,"avatar files is required");
     }

     const avatar=await uploadcloudinary(avatarlocalpath)
     const coverimage=await uploadcloudinary(coverimagelocalpath)

     if(!avatar){
      throw new APIError(400,"avatar files is required");

     }

    const user=await User.create({
      avatar:avatar.url,
      coverimage:coverimage?.url||"",
      email,
      password,
      fullname,
      username:username?.toLowerCase(),
     })
  const createduser=await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createduser){
    throw new APIError(500,"user not registered in server")
  }

  return res.status(201).json(
    new Apiresposnse(200,createduser,"user registered successfully")
  )
     
})

export default registerUser;

