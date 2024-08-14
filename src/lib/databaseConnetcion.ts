import mongoose from "mongoose";

// Connect to MongoDB
type connectionObject = {
    isConnected?: number;
}

const connection: connectionObject = {};
async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log('Already connected to the database.');
        return;
    }
   try {
   const db = await mongoose.connect(process.env.MONGODB_URI || "")
   connection.isConnected = db.connections[0].readyState;
   console.log("Database connected successfully");

   } catch (error) {
    console.log("Database connection failed: ", error);
    process.exit(1);
   }
}

export default dbConnect