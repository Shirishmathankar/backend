
import connectDB from "./db/index.js"
import dotenv from "dotenv"
dotenv.config({
    path: './env'
})

connectDB();






/*
;import { DB_NAME } from "./constants";
(async()=>{
    try{
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      app.on("error",()=>{//if because of express not connect to mongodb this type of function is lot 
        console.log("ERROR",error);
        throw error
      })

      app.listen(process.env.PORT,()=>{
        console.log(`app is listening on ${process.env.PORT}`)
      })
    }
    catch (error){
        console.log("ERROR:",error)
        throw err
    }
})()
*/