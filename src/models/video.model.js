import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoScehma=new Schema({
     videofile:{
        type:String,
        required:true
     },
     thumbnail:{
        type:String,
        required:true
     },
      description:{
        type:String,
        required:true
     },
    
     duration:{
        type:Number,
        requied:true
 
      },
      views:{
        type:Number,
        default:0
 
      },
        isPublished:{
        type:Boolean,
        default:true
 
      },
      owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
      },
      
      },
      {
        timestamps:true
      } 
)
videoScehma.plugin(mongooseAggregatePaginate)
export const Video= mongoose.model("Video",videoScehma)