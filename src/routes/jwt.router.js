import { Router } from "express";
import JWT from "../controllers/jwt.controller.js";

const JWTrouter = Router();

JWTrouter.post("/login", JWT);

export default JWTrouter;
