import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";

//FAKER
faker.locale = "es";
export const generateProducts = () => {
  let numOfProducts = parseInt(
    faker.random.numeric(1, { bannedDigits: ["0"] })
  );
  for (let i = 0; i < numOfProducts; i++) {
    return {
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productAdjective(),
      stock: faker.random.numeric(1),
      id: faker.database.mongodbObjectId(),
      image: faker.image.image(),
    };
  }
};

//IMPLEMENTACION BCRYPT
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
  console.log(
    `Datos a validar: user-password: ${user.password}, password: ${password}`
  );
  return bcrypt.compareSync(password, user.password);
};

export const comparePasswords = async (newPassword, hashedPassword, res) => {
  try {
    const passwordMatch = await bcrypt.compare(newPassword, hashedPassword);

    if (passwordMatch) {
      console.log("¡Alerta! Contraseña ya utilizada.");
      return res
        .status(401)
        .json({ message: "Contraseña ya utilizada", passwordUsed: true });
    } else {
      console.log("Contraseña válida.");
      return res
        .status(200)
        .json({ message: "Contraseña válida", passwordUsed: false });
    }
  } catch (error) {
    console.error("Error al comparar contraseñas:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

//JWT
export const PRIVATE_KEY = "CoderhouseSecretKeyJWT";

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
