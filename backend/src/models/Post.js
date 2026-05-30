import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content:{
        type: String,
        trim: true,
        minlength: 4,
        maxlength: 3000
    },
    image: {
        type: String,
        default: ""
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);

export default Post;