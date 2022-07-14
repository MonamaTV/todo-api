import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Users } from "../models/User";

import HttpCodes from "../utils/responses/httpCodes";
const { BADREQUEST, INTERNALERROR, UNAUTHORISED } = HttpCodes;

export const isUserAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //Since the token is attached to the headers
    const bearer: string | any = req.headers["authorization"];
    //Bearer {token}
    const token = (bearer as string).split(" ")[1];
    if (!token) {
      return res.status(UNAUTHORISED).send({
        message: "The user is not authenticated",
        code: UNAUTHORISED,
        success: false,
      });
    }

    const verifiedUser = jwt.verify(
      token,
      process.env.SECRET_PAYLOAD as string
    );
    console.log(verifiedUser);
    //
    if (!verifiedUser) {
      return res.status(UNAUTHORISED).send({
        message: "The user is not authenticated",
        code: UNAUTHORISED,
        success: false,
      });
    }
    const { _id, email } = verifiedUser as any;
    //The user from the db to be attached to the request obj
    const user = await Users.findOne({ email, _id });
    if (!user) {
      return res.status(BADREQUEST).send({
        message: "The user is not registered",
        code: BADREQUEST,
        success: false,
      });
    }
    //It starting to looking like a bug having the 'as any'
    req.user = user;
    next();
  } catch (error) {
    res.status(INTERNALERROR).send({
      message: "Could not authenticate user",
      code: INTERNALERROR,
      success: false,
    });
  }
};
