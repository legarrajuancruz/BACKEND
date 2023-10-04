import { generateJWToken } from "../utils.js";

const users = async (req, res) => {};

const github = async (req, res) => {
  const user = req.user;

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
  };
  req.session.admin = true;
  res.redirect("/users/profile");
};

const login = async (req, res) => {
  const user = req.user;
  console.log("Usuario encontrado para login:");
  console.log(user);

  if (!user)
    return res
      .status(401)
      .send({ status: "error", error: "credenciales incorrectas" });
  const access_token = generateJWToken(user);
  console.log(access_token);
  res.send({ access_token: access_token });
};

const register = async (req, res) => {
  console.log("Nuevo usuario registrado");
  res
    .status(201)
    .send({ status: "success", message: "Usuario creado con exito" });
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    response.redirect("/users/login");
  });
};

const failRegister = (req, res) => {
  res.status(401).send({ error: "Error al procesar el registro" });
};

const failLogin = (req, res) => {
  res.status(401).send({ error: "Error al procesar el login" });
};

export default {
  users,
  github,
  login,
  register,
  logout,
  failLogin,
  failRegister,
};
