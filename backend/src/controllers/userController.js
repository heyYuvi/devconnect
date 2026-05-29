import mongoose from "mongoose";
import User from "../models/User.js";
import profileCardSchema from "../validations/ProfileCardValidations.js";

export const profileCard = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User Id"
            });
        }

        const user = await User.findById(id).select("-password -email");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        return res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                avatar: user.avatar,
                bio: user.bio,
                followers: user.followers.length,
                following: user.following.length,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.log("Profile Card Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

 export const updateProfileCard = async (req, res) => {
    try{
        
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid User Id"
        });
    }
    const user = await User.findById(id).select("-password -email");
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User Not Found"
        });
    }

    if(user._id.toString() != req.user._id.toString()) {
        return res.status(409).json({
            success: false,
            message: "Not allowed"
        });
    }

    const result = profileCardSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: result.error.issues
        });
    }

    const data = result.data;
    
    if(data.username){
        const isMatch = await User.findOne({ username: data.username });
    if(isMatch && isMatch._id.toString() != req.user._id.toString()){
        return res.status(400).json({
            success: false,
            message: "Username Already Taken. Try another username"
        });
    }
    }

    user.username = data.username ?? user.username
    user.bio = data.bio ?? user.bio

    await user.save();

    return res.json({
        success: true,
        message: "Profile updated",
        data: {
            id: user._id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
    }catch(error){
        console.log("Update Profile Card Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}