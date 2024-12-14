import express from "express"
import cors from "cors"//middleware
import cookieParser from "cookie-parser"; 
//cookie parser is use to perform crud operation on user's browser securely 
const app=express();
 app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
 }))
//app.use is use to set middleware for configuration
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))//if data is in url is not send directly we %,= is added to url so we have to pass like this
app.use(express.static("public"))//to store files in our server
app.use(cookieParser)
//cookie parser is use to acces cookie user browser
export default app