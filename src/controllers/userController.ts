import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { IUser, Users } from "../models/User";
import { verifyID } from "../utils/verifyObjectID";
import HttpCodes from "../utils/responses/httpCodes";
import { comparePasswords, hashPassword } from "../utils/encyptPasswords";
import { assignToken } from "../utils/jwt";
import {
  validateLoginDetails,
  validateUser,
} from "../utils/validation/userValidation";

const { OK, BADREQUEST, ACCEPTED, CREATED, INTERNALERROR } = HttpCodes;

export const loginUser = async (req: Request, res: Response) => {
  //
  const userPassword: string = req.body.password;
  const userEmail: string = req.body.email;
  //
  if (validateLoginDetails(userEmail, userPassword).error) {
    return res.status(OK).send({
      message: "Email or password is incorrect",
      code: BADREQUEST,
      success: false,
    });
  }
  try {
    const user = await Users.findOne({ email: userEmail });
    if (!user) {
      return res.status(OK).send({
        message: "The user does not exist",
        code: BADREQUEST,
        success: false,
      });
    }

    //if user exists
    const matchingPasswords = await comparePasswords(
      user.password,
      userPassword
    );
    if (!matchingPasswords) {
      return res.status(BADREQUEST).send({
        message: "Email or password do not match our records",
        code: BADREQUEST,
        success: false,
      });
    }
    const { password, ...restUser } = (user as any)?._doc;

    const token = assignToken(restUser);
    res.header("token", token).status(200).send({
      message: "Logged in user",
      data: restUser,
      code: 200,
      success: true,
      token,
    });
  } catch (error) {
    res.status(INTERNALERROR).send({
      message: "Something went wrong during the login process",
      code: INTERNALERROR,
    });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const userObj: IUser = req.body;
  //Check if user details are in order
  if (validateUser(userObj).error) {
    return res.status(OK).send({
      message: "The user details are invalid",
      code: BADREQUEST,
      success: false,
    });
  }
  try {
    const registeredUser = await Users.findOne({ email: userObj.email });
    //The user exists
    if (registeredUser) {
      return res.status(OK).send({
        message: "The user is already registered",
        code: BADREQUEST,
        success: false,
      });
    }
    //if not
    const encryptedPassword = await hashPassword(userObj.password);
    const user = new Users({
      name: userObj.name,
      email: userObj.email,
      password: encryptedPassword,
    });

    //Save the user
    await user.save();

    //If errors occur during the saving process
    if (user.errors) {
      return res.status(OK).send({
        code: BADREQUEST,
        message: "Failed to register user",
        success: false,
      });
    }

    //Assing jwt
    const { password, ...restUser } = (user as any)?._doc;
    const token = assignToken(restUser);

    res.header("token", token).status(CREATED).send({
      message: "New user added",
      data: restUser,
      code: 201,
      success: true,
      token,
    });
  } catch (error) {
    res.status(INTERNALERROR).send({
      message: "Something went wrong during registration",
      code: INTERNALERROR,
      success: false,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { _id } = req.user;
  if (!verifyID(_id)) {
    return res.status(400).send({
      message: "The user id is not valid",
      code: 400,
      data: null,
    });
  }
  try {
    const user = await Users.findOne({ _id }, { password: 0 });

    if (!user) {
      return res.status(404).send({
        message: "The user was not found",
        code: 404,
        data: null,
      });
    }
    res.status(200).send({
      message: "User details",
      code: 200,
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error,
      code: 400,
      data: null,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const newUserData: IUser = req.body;
  //Check if user details are in order
  if (validateUser(newUserData).error) {
    return res.status(OK).send({
      message: "The user details are invalid",
      code: BADREQUEST,
      success: false,
    });
  }
  try {
    const { _id, email } = req.user;
    const registeredUser = await Users.findOne({ email, _id });
    //The user exists
    if (registeredUser === null) {
      return res.status(OK).send({
        message: "The user is not available",
        code: BADREQUEST,
        success: false,
      });
    }
    //if not
    const newEncryptedPassword = await hashPassword(newUserData.password);
    //New password?
    const newPassword: boolean = await comparePasswords(
      registeredUser.password,
      newUserData.password
    );

    await registeredUser.updateOne({
      name: newUserData.name,
      password: newPassword ? registeredUser.password : newEncryptedPassword,
    });
    //If errors occur during the saving process
    if (registeredUser.errors) {
      return res.status(OK).send({
        code: BADREQUEST,
        message: "Failed to update user",
        success: false,
      });
    }

    //Assing jwt
    const { password, ...restUser } = (registeredUser as any)?._doc;
    const token = assignToken(restUser);

    res.header("token", token).status(OK).send({
      message: "Updated user",
      data: restUser,
      code: OK,
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(INTERNALERROR).send({
      message: "Something went wrong during updating",
      code: INTERNALERROR,
      success: false,
    });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  // Todo: The user cannot be totally erased from the database... rather keep their id and empty the fields with their information
  try {
    const { email, _id } = req.user;
    const deleteUser = await Users.updateOne(
      { email, _id },
      {
        $set: {
          email: "",
          name: "",
          password: "",
        },
      }
    );
    if (deleteUser.modifiedCount < 1) {
      return res.send(OK).send({
        message: "User deletion failed, try again!",
        code: BADREQUEST,
        success: false,
      });
    }

    res.status(OK).send({
      message: "The user is deleted",
      code: OK,
      success: true,
    });
  } catch (error) {
    res.status(INTERNALERROR).send({
      messagae: "Something went wrong",
      code: INTERNALERROR,
      success: false,
    });
  }
};
