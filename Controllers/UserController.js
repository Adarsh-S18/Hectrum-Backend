import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';

// G E T   U S E R 

export const getUser = async(req,res)=>{
    const id = req.params.id
    try {
        const user = await UserModel.findById(id);
        if(user){
            const {password , ...otherDetails}= user._doc
            res.status(200).json(otherDetails)
        }else{
            res.status(404).json("User not found")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

// U P D A T E   U S E R 

export const updateUser = async(req,res)=>{
    const id= req.params.id;
    const { currentUserId , password }= req.body

    if(id === currentUserId){
        try {
            if(password){
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password,salt)
            }
            const user = await UserModel.findByIdAndUpdate( id , req.body , {new:true} )
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err)
        }

    }else{
        res.status(500).json("Invalid request")
    }
}

//  D E L E T E    U S E R 


export const deleteUser = async(req,res)=>{
    const id = req.params.id;
    const {currentUserId}= req.body
    if(currentUserId === id){
        try {
             await UserModel.findByIdAndDelete(id)
             res.status(200).json("User Deleted")
        } catch (err) {
            res.status(500).json(err)
        }
    }else{
        res.status(500).json("Not able to delete")
    }
}

//   F O L L O W    U S E R 

 export const followUser = async(req,res)=>{
    const id = req.params.id;
    const {currentUserId} = req.body

    if(currentUserId === id){
        res.status(500).json("Request forbidden")
    }else{
        try {
            const followUser =await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);


            if(! followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$push :{followers:currentUserId}})
                await followingUser.updateOne({$push:{following:id}})
                res.status(200).json("User Followed")
            }else{
                res.status(403).json("User is already been followed")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }
 }


 //   U N F O L L O W    U S E R 

 export const UnfollowUser = async(req,res)=>{
    const id = req.params.id;
    const {currentUserId} = req.body

    if(id=== currentUserId){
        res.status(500).json("Invalid request");
    }else{
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);

            if(followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$pull:{followers:currentUserId}});
                await followingUser.updateOne({$pull:{following:id}})
                res.status(200).json("User has been unfollowed");
            }
            else{
                res.status(403).json("User is not being followed")

            }
        } catch (err) {
            res.status(500).json(err)
        }
    }
 }

 