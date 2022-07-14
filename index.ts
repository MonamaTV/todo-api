import express, { Response, Request, Express } from "express";
import { connectDB } from "./src/db/db";
import userRoute from "./src/routes/userRoute";
import todoRoute from "./src/routes/todoRoute";
import authRoute from "./src/routes/authRoute";
import dotenv from "dotenv";
import { isUserAuthenticated } from "./src/middleware/authMiddleware";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.send("index.html");
});

app.use("/auth", authRoute);
//All routes below this line are authenticated
app.use(isUserAuthenticated);
app.use("/todos", todoRoute);
app.use("/users", userRoute);

app.listen(8000, () => {
  console.log("Server is running");
  try {
    connectDB(); //Connect the database
  } catch (error) {
    console.log(error);
  }
});
