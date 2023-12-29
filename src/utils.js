import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from "path";

import multer from "multer";
import bcrypt from "bcrypt";
import path from "path";

import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";

//MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determina el tipo de archivo y configura la carpeta correspondiente
    let folder;
    switch (file.fieldname) {
      case "identificationDocument":
        folder = path.join(__dirname + "/uploads/documents");
        break;
      case "domicileDocument":
        folder = path.join(__dirname + "/uploads/documents");
        break;
      case "accountStatementDocument":
        folder = path.join(__dirname + "/uploads/documents");
        break;
      case "profiles":
        folder = path.join(__dirname + "/uploads/profiles");
        break;
      case "document":
        folder = path.join(__dirname + "/uploads/documents");
        break;
      default:
        folder = path.join(__dirname + "/uploads/products");
    }

    const uploadPath = path.join(folder);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = path.basename(file.originalname);
    cb(null, fileName);
  },
});

export const uploader = multer({
  storage,
  onError: function (error, next) {
    console.log(error);
    next();
  },
});

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

//BCRYPT
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
  console.log(
    `Datos a validar: user-password: ${user.password}, password: ${password}`
  );
  return bcrypt.compareSync(password, user.password);
};
//funcion para validar la contraseña
export const comparePasswords = async (newPassword, hashedPassword) => {
  try {
    const passwordMatch = await bcrypt.compare(newPassword, hashedPassword);

    if (passwordMatch) {
      console.log("¡Alerta! Contraseña ya utilizada.");
      return true;
    } else {
      console.log("Contraseña válida.");
      return false;
    }
  } catch (error) {
    console.error("Error al comparar contraseñas:", error);
    throw error;
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
