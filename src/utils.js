import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import jwt from "jsonwebtoken";
import passport from "passport";

//IMPLEMENTACION BCRYPT
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
  console.log(
    `Datos a validar: user-password: ${user.password}, password: ${password}`
  );
  return bcrypt.compareSync(password, user.password);
};

//JWT
const PRIVATE_KEY = "CoderhouseSecretKeyJWT";

export const generateJWToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Token presente en header auth");
  console.log(authHeader);
  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "Usuario no autenticado o token no encontrado" });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error)
      return res.status(403).send({ error: "Token invalido: no autorizado" });
    req.user = credentials.user;
    console.log(req.user);
    next();
  });
};

export default __dirname;
