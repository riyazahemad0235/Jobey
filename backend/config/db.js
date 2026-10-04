import mongoose from "mongoose";

let connecting = null;

// Safe to call on every request: it reuses the existing connection.
const connectDb = async () => {
  if (mongoose.connection.readyState === 1) return;

  const uri =
    process.env.MONGO_URI ||
    (process.env.NODE_ENV === "production"
      ? null
      : "mongodb://127.0.0.1:27017/jobtracker");

  if (!uri) throw new Error("MONGO_URI is not set");

  if (!connecting) {
    connecting = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000 })
      .then(() => console.log("MongoDb is Connected"))
      .catch((err) => {
        connecting = null; // allow a retry on the next request
        throw err;
      });
  }
  await connecting;
};

export default connectDb;
