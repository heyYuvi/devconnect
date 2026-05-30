import mongoose from "mongoose";
import Post from "../models/Post.js";
import commentSchema from "../validations/CommentValidations.js";
import Comment from "../models/Comment.js";

// Post Comment 

export const createComment = async (req, res) => {
    try{
        const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Post Id"
        });
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post Not Found"
        });
    }

    const result = commentSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: result.error.issues
        });
    }

    const data = result.data;

    const comment = await Comment.create({
        text: data.text.trim(),
        post: postId,
        author: req.user._id
    });

    post.comments.push(comment._id);
    await post.save();

    await comment.populate("author", "name username avatar");

    return res.status(201).json({
        success: true,
        message: "Commented Succesfully",
            data: {
                postId: postId,
                id: comment._id,
                text: comment.text,
                author: {
                    id: comment.author._id,
                    name: comment.author.name,
                    username: comment.author.username,
                    avatar: comment.author.avatar
                },
                createdAt: comment.createdAt
        }
    })
    }catch(error){
        console.log("Created Comment Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Delete Comment

export const deleteComment = async (req, res) =>{
    try{
        
    const commentId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        return res.status(400).json({
            success: false,
            message: "Invaid Comment Id"
        });
    }

    const comment = await Comment.findById(commentId);
    if(!comment){
        return res.status(404).json({
            success: false,
            message: "Comment Not Found"
        });
    }

        const post = await Post.findById(comment.post);

    if(comment.author.toString() !== req.user._id.toString() && post.author.toString() !== req.user._id.toString()){
        return res.status(403).json({
            success: false,
            message: "Not Allowed" 
        }); 
    }

    await comment.deleteOne();

    post.comments.pull(comment._id);
    await post.save();

    return res.status(200).json({
        success: true,
        message: "Comment Deleted"
    });
    }catch(error){
        console.log("Delete Comment Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}