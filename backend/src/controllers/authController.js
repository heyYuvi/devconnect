import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import registerSchema from "../validations/RegisterValidations.js";
import User from "../models/User.js";
import loginSchema from "../validations/LoginValidations.js";

// User Register

export const register = async (req, res) => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error.issues
            });
        }

        const data = result.data;

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists"
            });
        }

        const hashedPassword = await bcryptjs.hash(data.password, 10);

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "User Registered",
            data: {
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.log("Register Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Login User

export const login = async (req, res) =>{
    try{
        
    const result = loginSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            success: false,
            error: result.error
        });
    }

    const data = result.data;

    const user = await User.findOne({ email: data.email });
    if(!user){
        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        });
    }

    const isMatch = await bcryptjs.compare(data.password, user.password);
    if(!isMatch){
        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        });
    }

    const token = jwt.sign(
        { id: user._id},
        process.env.JWT_SECRET,
        { expiresIn: "7d"}
    );

    return res.json({
        success: true,
        message: "Login Successful",
        data: {
            name: user.name,
            email: user.email
        },
        token
    });
    }catch(error){
        console.log("Login Error", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}