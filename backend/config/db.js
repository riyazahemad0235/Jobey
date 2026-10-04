import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobtracker",
    );
    console.log("MongoDb is Connected");
  } catch (error) {
    console.error("The Connection failed:", error.message);
    // Don't keep running without a database
    process.exit(1);
  }
};

export default connectDb;
