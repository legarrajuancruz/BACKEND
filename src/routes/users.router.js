import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { authToken } from "../utils.js";

const usersRouter = Router();

usersRouter.get("/:userId", authToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res
        .status(202)
        .json({ message: "Usuario no encontrado con ID " + userId });
    }
    res.json(user);
  } catch (error) {
    console.error("Error consultando usuario por ID" + userId);
  }
});

export default usersRouter;
