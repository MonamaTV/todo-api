import jwt from "jsonwebtoken";

export const assignToken = (payload: any): string => {
  try {
    const token = jwt.sign(payload, process.env.SECRET_PAYLOAD as string);
    return token;
  } catch (error) {
    return "";
  }
};
