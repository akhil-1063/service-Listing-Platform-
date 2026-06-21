import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const connString: string = process.env.MONGO_URI as string;
    if (!connString) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    await mongoose.connect(connString);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
