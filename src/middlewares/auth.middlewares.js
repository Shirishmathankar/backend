import APIError from "../utils/APIerror.js"
import asynchandler from "../utils/Asynchandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
const VerifyJwt=asynchandler(async(req, _,next)=>{
 try{
  
    const token =req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
    if(!token){
        throw new APIError(401,"unauthorized req")
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user =await User.findOne(decodedToken._id).select("-password refreshToken")

    if(!user){
        APIError(401,invalidtoken)
    }
    req.user=user
    next();


 }
 catch(error){
    throw new APIError(401,error?.message||"token is invalid")
 }
})
    

export default VerifyJwt
