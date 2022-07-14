import { Router } from "express";
import {
  getTodo,
  addNewTodo,
  updateTodo,
  deleteTodo,
  getTodos,
} from "../controllers/todoController";

const router = Router();

router.get("/", getTodos);

router.get("/:todoID", getTodo);

router.post("/", addNewTodo);

router.patch("/:todoID", updateTodo);

router.delete("/:todoID", deleteTodo);

export default router;
