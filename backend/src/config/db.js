import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connection Established ${conn.connection.host}`)
    }catch(error){
        console.log(`Failed to Establish Connection ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;