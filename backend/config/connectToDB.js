import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to DB");
  } catch (err) {
    console.log("Error connecting to DB", err);
  }
};
