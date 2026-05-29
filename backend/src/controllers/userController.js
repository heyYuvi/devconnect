import mongoose from "mongoose";
import User from "../models/User.js";
import profileCardSchema from "../validations/ProfileCardValidations.js";

//  Fetch Profile Card
export const profileCard = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User Id"
            });
        }

        const user = await User.findById(id).select("-password -email").populate("followers", "username name avatar").populate("following", "name username avatar");
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
                username: user.username,
                avatar: user.avatar,
                bio: user.bio,
                followersCount: user.followers.length,
                followingCount: user.following.length,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                followers: user.followers,
                following: user.following
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

// Update Profile Card

export const updateProfileCard = async (req, res) => {
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

        if (user._id.toString() != req.user._id.toString()) {
            return res.status(403).json({
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

        if (data.username) {
            const isMatch = await User.findOne({ username: data.username });
            if (isMatch && isMatch._id.toString() != req.user._id.toString()) {
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
    } catch (error) {
        console.log("Update Profile Card Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Follow Toggle 

export const followToggle = async (req, res) => {
    try {
        const targetedUserId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(targetedUserId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User Id"
            });
        }

        if (targetedUserId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Not allowed"
            });
        }

        const targetedUser = await User.findById(targetedUserId);
        if (!targetedUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const following = req.user.following.some((userId) => userId.toString() === targetedUser._id.toString());
        if (following) {
            req.user.following.pull(targetedUser._id);
            targetedUser.followers.pull(req.user._id)
        }
        else {
            req.user.following.push(targetedUser._id);
            targetedUser.followers.push(req.user._id);
        }

        await req.user.save();
        await targetedUser.save();

        return res.status(200).json({
            success: true,
            message: following ? "Unfollowed" : "Followed",
            data: {
                CurrentuserData: {
                    followers: req.user.followers.length,
                    following: req.user.following.length
                },
                targetedUserData: {
                    followers: targetedUser.followers.length,
                    following: targetedUser.following.length
                }
            }
        });

    } catch (error) {
        console.log("Follow Toggle Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}