import Joi from "joi";
import { IUser } from "../../models/User";

const joiUser = Joi.object<IUser>({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required().min(8),
});

export const validateUser = (user: IUser) => joiUser.validate(user);

export const validateLoginDetails = (email: string, password: string) => {
  return Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }).validate({ email, password });
};
