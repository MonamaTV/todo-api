import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    connect(process.env.DB_URI as string, {}, (error) => {
      if (error) throw error;
      console.log("the db is connected");
    });
  } catch (error) {
    throw error;
  }
};
