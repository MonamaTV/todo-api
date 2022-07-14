import { Response, Request } from "express";
import { ITodo, Todos } from "../models/Todo";
import { validateTodo } from "../utils/validation/todoValidation";
import HttpCodes from "../utils/responses/httpCodes";
import { verifyID } from "../utils/verifyObjectID";
const { BADREQUEST, CREATED, INTERNALERROR, NOTFOUND, OK } = HttpCodes;

export const getTodo = async (req: Request, res: Response) => {
  const todoID: string = req.params.todoID;
  if (!verifyID(todoID)) {
    return res.status(OK).send({
      message: "Invalid Todo ID",
      success: false,
      code: NOTFOUND,
    });
  }
  try {
    //Grap the user id from the req obj
    const { _id } = req.user;
    const todo = await Todos.findOne({ userID: _id, _id: todoID });
    if (!todo) {
      return res.status(OK).send({
        message: "Todo not found",
        code: NOTFOUND,
        success: false,
      });
    }

    res.status(OK).send({
      code: OK,
      message: "Todo",
      data: todo,
      success: true,
    });
  } catch (error) {
    return res.status(INTERNALERROR).send({
      message: "Something went wrong",
      success: false,
      code: INTERNALERROR,
    });
  }
};
export const addNewTodo = async (req: Request, res: Response) => {
  const todoObj: ITodo = req.body;
  //If there is an error validating
  if (validateTodo(todoObj).error) {
    return res.status(BADREQUEST).send({
      message: "The todo values are invalid",
      code: BADREQUEST,
      success: false,
    });
  }
  try {
    const user = req.user;
    const todo = new Todos({
      content: todoObj.content,
      description: todoObj.description,
      title: todoObj.title,
      userID: user._id,
      completed: false,
    });

    await todo.save();
    //If errors occur
    if (todo.errors) {
      return res.status(OK).send({
        message: "Failed to save todo",
        code: BADREQUEST,
        success: false,
      });
    }
    //Respond
    res.status(CREATED).send({
      message: "Todo created",
      code: CREATED,
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(INTERNALERROR).send({
      message: "Failed to create Todo",
      code: INTERNALERROR,
      success: false,
    });
  }
};
export const updateTodo = (req: Request, res: Response) => {
  //Todo: To be implemented
};
export const getTodos = async (req: Request, res: Response) => {
  try {
    //Maybe some pagination
    const limit: number = parseInt(req.query?.limit as string) || 10;
    const page: number = parseInt(req.query?.page as string) || 1;
    const { _id } = req.user;
    //Get todos with some pagination
    const todos = await Todos.find({ userID: _id })
      .limit(limit)
      .skip((page - 1) * limit);

    //User todos
    res.status(OK).send({
      message: "User todos",
      code: OK,
      sucess: true,
      data: todos,
    });
  } catch (error) {
    res.status(INTERNALERROR).send({
      message: "Failed to get the todos",
      code: INTERNALERROR,
      success: false,
    });
  }
};
export const deleteTodo = async (req: Request, res: Response) => {
  const todoID: string = req.params.todoID;
  const user = req.user;

  if (!verifyID(todoID)) {
    return res.status(OK).send({
      message: "Todo not found",
      code: NOTFOUND,
      success: false,
    });
  }

  try {
    const { _id } = user;
    const deleted = await Todos.deleteOne({ userID: _id, _id: todoID });
    //If the number of deleted docs is less than one the... obvious
    if (deleted.deletedCount < 1) {
      res.status(OK).send({
        message: "Todo not deleted",
        code: BADREQUEST,
        success: false,
      });
    }
    res.status(OK).send({
      message: "Todo deleted",
      code: OK,
      success: true,
    });
  } catch (error) {
    res.status(INTERNALERROR).send({
      message: "Todo not deleted",
      code: INTERNALERROR,
      success: false,
    });
  }
};
