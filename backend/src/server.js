import express from "express";
import connectDb from "./config/db.js"
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", protect, (req, res) =>{
    res.json({
        success: true,
        message: "DevConnect is Running"
    });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes)

const startServer = async () =>{
    try{
        await connectDb();
        app.listen(PORT, () =>{
            console.log(`Server is Running on Port ${PORT}`)
        })
    }catch(error){
        console.log(`Server Failed ${error.message}`);
    }
}

startServer();
