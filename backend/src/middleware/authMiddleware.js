import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token Not Provided or Invalid Token"
            });
        }

        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.id).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "User Not Found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Auth Erro", error.message);
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
}

export default protect;