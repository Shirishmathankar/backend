import asynchandler from "../utils/Asynchandler.js";

import APIError from "../utils/APIerror.js";
import {User} from "../models/user.model.js";
import uploadcloudinary from "../utils/cloudinary.js";
import Apiresposnse from "../utils/Apiresponse.js";

 const generateAccessAndRefreshtoken=async (userId)=>{

   try{
     const user = await findById(userId)
     const accessToken= await user.generateAccessToken();
     const refreshToken= await user.generateRefreshToken();
     user.refreshToken=refreshToken
     await user.save({validateBeforeSave:false});
     return {accessToken,refreshToken}  
   }
   catch(error){
      throw new APIError(500,"something went wrong while generating access and refresh token")
   }
 }
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
     //const coverimagelocalpath= await req.files?.coverimage[0]?.path;
    // console.log("avatar",req.files)
      let coverimagelocalpath;
      if(req.files&&Array.isArray(req.files?.coverimage)&&req.files.coverimage.length>0){
        coverimagelocalpath=req.files.coverimage[0]?.path;
      }
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
  
const loginUser=asynchandler(async (req,res) => {
    
  const {username,email,password}=req.body
   
  if(!(username||email)){
    throw new APIError(400,"username or email is required")
    return 
  }
  
  const user=await User.findOne({
    $or:[{username},{email}]
  })
  
   if(!user)
   {
      throw new APIError(404,"username or email is not valid")
      return 
   }
  
   const isPassword=await user.isPasswordCorrect(password);

   if(!isPassword){
    throw new APIError(401,"invalid credentials")
    return 
   }

   const {accessToken, refreshToken}=await generateAccessAndRefreshtoken(user._id)
   
   const logedInUser=await findById(user._id).select(-password -refreshToken);

   const options= {
    httpOnly:true,
    secure:true
   }
 
   return res
   .status(200)
   .cookie("accessToken" ,accessToken,options)
   .cookie("refreshToken", refreshToken,options)
   .json(
    new Apiresponse(
      200,
      {
        user : logedInUser,accessToken,refreshToken,
      },
      "user logged in successfully"
    )
    )

})
 const logoutUser=asynchandler(async (req,res)=>{
   
  await User.findByIdAndUpdate(req.user._id,{
    $set:{refreshToken:undefined}

  },{
    new :true
  })
  
  const options= {
    httpOnly:true,
    secure:true
   }
    
   return res.status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(200,"","user loggedout successfully ")
 })

export  {registerUser,loginUser,logoutUser};

