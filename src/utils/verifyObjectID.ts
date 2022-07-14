import { isValidObjectId } from "mongoose";

export const verifyID = (objID: string) => {
  return isValidObjectId(objID);
};
