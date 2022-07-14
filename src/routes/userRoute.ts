import express, { Router } from "express";
import { getUser, deleteUser, updateUser } from "../controllers/userController";

const router: Router = express.Router();

router.get("/", getUser);

router.delete("/", deleteUser);

router.patch("/", updateUser);

export default router;
