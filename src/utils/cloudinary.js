import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"


    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

   const uploadcloudinary= async(localfilepath)=>{
     try{
            if(!localfilepath){
                return null
            }
            //upload file to the cloudinary
            const response=await cloudinary.uploader.upload(filepath,{
                resource_type:'auto'
            })
            console.log("file is uploaded successfully",response);
            return response
     }
     catch(error){
      fs.unlinkSync(localfilepath)
      //remove the file from  local server as file  already reach on the server
       return null
     }

   } 

   export default uploadcloudinary
   