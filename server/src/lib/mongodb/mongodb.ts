import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI as string | undefined;

async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env"
    );
  }
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("Successfully connected to MongoDB");
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log("Already connected to MongoDB");
  }
}

export default connectToDatabase;
