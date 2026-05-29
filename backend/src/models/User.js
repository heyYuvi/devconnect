import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
    },
    avatar: {
        type: String,
        default: "https://i.pinimg.com/736x/b9/e8/db/b9e8db33168a26c9ca697a05ddc80937.jpg"
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 300
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},{timestamps: true});


const User = mongoose.model("User", userSchema);

export default User;