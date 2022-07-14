import { Schema, model, Types } from "mongoose";

export interface ITodo {
  title: string;
  description: string;
  content: string;
  createdAt?: Date;
  completed?: boolean;
  userID?: Types.ObjectId;
}

const todoSchema = new Schema<ITodo>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  completed: {
    required: false,
    type: Boolean,
    default: false,
  },
  userID: {
    ref: "Users",
    required: true,
    type: Types.ObjectId,
  },
});

export const Todos = model<ITodo>("Todos", todoSchema);
