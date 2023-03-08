
import mongoose from 'mongoose';
import PostModel from '../Models/postModel.js';
import UserModel from '../Models/userModel.js';


export const createPost = async(req,res)=>{
    const newPost = new PostModel(req.body)
    try {
        await newPost.save()
        res.status(200).json("Post created")
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getPost = async(req,res)=>{
    const id = req.params.id;
    try {
        const post = await PostModel.findById(id)
        post ? res.status(200).json(post) : res.status(400).json("Invalid")
    } catch (err) {
        res.status(500).json(err)
    }
}

export const updatePost = async(req,res)=>{
    const id = req.params.id;
    const { userId } = req.body
    try {
        const post = await PostModel.findById(id)
        if(post.userId === userId){
            await post.updateOne({ $set : req.body})
            return res.status(200).json("Updated successfully")
        }else{
            return res.status(403).json("Invalid")
        }
    } catch (err) {
        return res.status(500).json(res)
    }
}


export const deletePost = async(req,res)=>{
    const id = req.params.id
    const {userId} = req.body
    try {
        const post = await PostModel.findById(id)
        if(post.userId === userId){
            await post.deleteOne()
            return res.status(200).json("Deleted post!")
        }else{
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const likePost = async(req,res)=>{
    const id = req.params.id
    const {userId} = req.body
    try {
        const post = await PostModel.findById(id)
        if(!post.likes.includes(userId)){
            await post.updateOne({$push :{likes :userId}})
            return res.status(200).json("Post Liked");
        }else{
            await post.updateOne({$pull :{likes :userId}})
            return res.status(200).json("Post UnLiked");
        }
    } catch (error) {
        return res.status(500).json(error)
        
    }
}


// GET TIMELINE POST


export const getTimelinePost = async (req,res) =>{
    const userId = req.params.id
    try {
        const currentUserPosts = await PostModel.find({userId:userId})
        const followingPosts = await UserModel.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(userId)
                }
            },{
                $lookup:{
                    from :"posts",
                    localField :"following",
                    foreignField :"userId",
                    as:"followingPosts"
                }
            },{
                $project:{
                    followingPosts :1,
                    _id :0 
                }
            }
        ])
        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts).sort((a,b)=>{
            return b.createdAt - a.createdAt;
        }))
    } catch (error) {
        return res.status(500).json(error)
    }
}