import { Schema, model, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  id?: Types.ObjectId;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export const Users = model<IUser>("Users", userSchema);
