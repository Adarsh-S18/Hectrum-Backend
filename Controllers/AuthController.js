import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';

export const registerUser = async(req,res)=>{
    const {username,mobilenumber,email,password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password,salt)
    const newUser = new UserModel({username,mobilenumber,email,password:hashedPass})

    try {
        await newUser.save()
        res.status(200).json("User Registered Successfully")
    } catch (err) {
        res.status(500).json("Try another Username")
    }
}


export const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await UserModel.findOne({email:email})
        if(user){
            const validity = await bcrypt.compare(password,user.password)
            validity ? res.status(200).json(user) : res.status(400).json("Password is wrong")
        }else{
            res.status(404).json("User does not exist")
        }
    } catch (err) {
        res.status(500).json({message:err.message})
    }
}