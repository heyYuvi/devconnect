import mongoose from "mongoose";
import Post from "../models/Post.js";
import postCheck from "../validations/PostValidations.js";

// Create Post

export const createPost = async (req, res) =>{
    try{
    const result = postCheck.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            success: false,
            error: result.error.issues
        });
    }

    const data = result.data;

    if(!data.content){
        return res.status(400).json({
            success: false,
            message: "Post Cannot Be Empty "
        });
    }

    const post =  await Post.create({
        content: data.content.trim(),
        author: req.user._id
    });

    await post.populate("author", "name username avatar");

    return res.status(201).json({
        success: true,
        message: "Post Created SuccessFully",
        data: {
            id: post._id,
            content: post.content,
            author: {
                id: post.author._id,
                name: post.author.name,
                username: post.author.username,
                avatar: post.author.avatar
            },
            createdAt: post.createdAt
        }
    });
    }catch(error){
        console.log("Created Post Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Get Single Post 

export const singlePost = async (req, res) =>{
    try{
        const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success: false,
            message: "Invalid Post Id"
        });
    }

    const post = await Post.findById(id);
    if(!post){
        return res.status(404).json({
            success: false,
            message: "Post Not Found"
        });
    }

    await post.populate("author", "name username avatar");

    return res.status(200).json({
        success: true,
         data: {
            id: post._id,
            content: post.content,
            author: {
                id: post.author._id,
                name: post.author.name,
                username: post.author.username,
                avatar: post.author.avatar,
            },
            createdAt: post.createdAt
         }
    });
    }catch(error){
        console.log("Get Single Post Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Delete Post

export const deletePost = async (req, res) =>{
    try{
        const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success: false,
            message: "Invalid Post Id"
        });
    }

    const post = await Post.findById(id);
    if(!post){
        return res.status(404).json({
            success: false,
            message: "Post Not Found"
        });
    }

    if(post.author.toString() !== req.user._id.toString()){
        return res.status(403).json({
            success: false,
            message: "Not Allowed"
        });
    }

    await post.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Post Deleted"
    });
    }catch(error){
        console.log("Delete Post Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// User Global Feed

export const globalFeed = async (req, res) =>{
    try{
        const posts = await Post.find().populate("author", "name username avatar").sort({ createdAt: -1});

    return res.status(200).json({
        success: true,
        message: "Global Posts Fetched",
        data: posts.map((post) =>({
            id: post._id,
            content: post.content,
            image: post.image,
            author: {
                id: post.author._id,
                name: post.author.name,
                username: post.author.username,
                avatar: post.author.avatar
            },
            createdAt: post.createdAt
        }))
    });
    }catch(error){
        console.log("Global Feed Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// User Feed

export const feed = async (req, res) =>{
    try{

        const page = Number(req.query.page) || 1;
        const limit = 4;
        const skip = (page - 1) * limit;

        const posts = await Post.find({
        author: {
            $in: [...req.user.following, req.user._id]
        }
    }).populate("author", "name username avatar").sort({ createdAt: -1}).limit(limit).skip(skip);


    const totalPosts = await Post.countDocuments({
        author: {
            $in: [...req.user.following, req.user._id]
        }
    });

    const totalPages = Math.ceil(totalPosts/limit);

    return res.status(200).json({
        success: true,
        message: "Posts Fetched",
        page: page,
        Limit: limit,
        skip: skip,
        totalPosts: totalPosts,
        totalPages: totalPages,
        data: posts.map((post) =>({
            id: post._id,
            content: post.content,
            image: post.image,
            author: {
                id: post.author._id,
                name: post.author.name,
                username: post.author.username,
                avatar: post.author.avatar
            },
            createdAt: post.createdAt
        }))
    });
    }catch(error){
        console.log("Feed Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}
