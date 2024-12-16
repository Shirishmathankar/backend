import mongoose ,{Schema} from "mongoose";
import bcrypt from bcrypt
import  JsonWebToken from "jsonwebtoken";//it is a bearer token jis ke bhi pass ho data bheja jayega 

const userSchema=new Schema({
username:{
  type:String,
  required:true,
  unique:true,
  lowercase:true,
  trim:true,
  index:true
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    
  },
  fullname:{
    type:String,
    required:true,
    trim:true,
    index:true
  },
  avatar:{
    type:String,
    required:true,

  },
  coverimage:{
    type:String,
  },
   watchhistory:[
    {
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
    ],
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
     type:String
    }

},
{
    timestamps:true
})
userSchema.pre("save", async function (next){
  if(!this.isModified("password"))return next();
  this.password=bcrypt(this.password,10);
  next();
})
userSchema.methods.isPasswordCorrect=async function(password){
return await bcrypt.compare(password,this.password)
}///mongoose have lot of methods
 
userSchema.methods.generateAccessToken= function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken=function(){
    jwt.sign({
        _id:this._id,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}


export const User=mongoose.model("User",userSchema)
