import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    connect(process.env.DB_URI as string, (error) => {
      if (error) throw error;
      console.log("the db is connected");
    });
  } catch (error) {
    throw error;
  }
};
