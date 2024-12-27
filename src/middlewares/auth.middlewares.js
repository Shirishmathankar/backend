import APIError from "../utils/APIerror.js";
import asynchandler from "../utils/Asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const VerifyJwt = asynchandler(async (req, _, next) => {
    try {
        // Extract token from cookies or Authorization header
        
        const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
       
        if (!token) {
            throw new APIError(401, "Unauthorized request: Token not provided");
        }
       
      
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                 
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
       
        if (!user) {
            throw new APIError(401, "Invalid token: User not found");
        }

        // Attach user to request and proceed
        req.user = user;
        next();
    } catch (error) {
        // Handle token errors (e.g., expired or invalid)
        const errorMessage = error.name === "TokenExpiredError"
            ? "Token has expired"
            : "Invalid token";

        throw new APIError(401, errorMessage);
    }
});

export default VerifyJwt;
