import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
    },
    likes:{
        type:Array
    },
    image:{
        type:String
    }
},
{timestamps : true})

const PostModel = mongoose.model("Posts",postSchema);
export default PostModel