import express from "express";
import userAuthentication from "../middleware/userAuthentication.js";
import { getUserData } from "../controllers/userController.js";
const userRouter = express.Router();



userRouter.get('/data',userAuthentication,getUserData);

export default userRouter;