import Joi, { Schema } from "joi";
import { ITodo } from "../../models/Todo";

const joiTodo = Joi.object<ITodo>({
  title: Joi.string().required(),
  description: Joi.string().required(),
  content: Joi.string().required(),
});

export const validateTodo = (todo: ITodo) => joiTodo.validate(todo);
