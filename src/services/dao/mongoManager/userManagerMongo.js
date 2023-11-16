import userModel from "../models/user.model.js";
import {
  createHash,
  isValidPassword,
  comparePasswords,
} from "../../../utils.js";

import config from "../../../config/config.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

export default class UserService {
  constructor() {
    console.log("Users with Database persistence in mongodb");
  }
  getUsers = async () => {
    let users = await userModel.find();
    return users;
  };

  getUserByID = async (id) => {
    let usuarioEncontrado = await userModel.findById(id);
    return usuarioEncontrado;
  };

  crearUsuario = async (usuarioNuevo) => {
    console.log(usuarioNuevo.email);
    if (usuarioNuevo.email === "adminCoder@coder.com") {
      usuarioNuevo.role = "admin";
      let result = await userModel.create(usuarioNuevo);
      return result;
    }
    if (usuarioNuevo.email === "premium@premium.com") {
      usuarioNuevo.role = "premium";
      let result = await userModel.create(usuarioNuevo);
      return result;
    }

    let result = await userModel.create(usuarioNuevo);
    console.log(usuarioNuevo);

    return result;
  };

  login = async (email) => {
    try {
      console.log(email);
      const userLogged = await userModel.findOne({ email });

      if (userLogged) {
        return userLogged;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  leerUsuarios = async ({ email }) => {
    console.log({ email });
    let users = await userModel.findOne({ email });

    return users;
  };

  updateUser = async (userId, ticketId) => {
    const user = await userModel.findById(userId);
    if (user) {
      user.orders.push({ ticket: ticketId });
      await user.save();
    }
    return user;
  };

  /*==========================
  -   ADD Products to Cart   -
  ==========================*/

  addProductToCart = async (uid, obj) => {
    try {
      const { _id, quantity } = obj;
      const filter = { _id: uid, "products._id": _id };
      const userCart = await userModel.findById(uid);
      const findProduct = userCart.products.some(
        (product) => product._id.toString() === _id
      );
      if (findProduct) {
        const update = { $inc: { "products.$.quantity": quantity } };
        await userModel.updateOne(filter, update);
      } else {
        const update = {
          $push: { products: { _id: obj._id, quantity: quantity } },
        };
        await userModel.updateOne({ _id: uid }, update);
      }
      return await userModel.findById(uid);
    } catch (error) {
      console.error(`Error al agregar  el producto al carrito`, error.nessage);
    }
  };

  /*==========================
  -      VACIAR CARRITO      -
  ==========================*/
  vaciarCarrito = async (_id) => {
    try {
      console.log("VACIANDO CARRITO");
      console.log(_id);
      const user = await userModel.updateOne({ _id: _id, products: [] });

      console.log(user.products);

      return user;
    } catch (error) {
      console.error("No se pudo vaciar el carrito", error);
    }
  };

  /*================================
  -   ENVIAR EMAIL RESET PASSWORD  -
  ================================*/
  emailResetPassword = async (userEmail) => {
    const user = await userModel.findOne(userEmail);

    if (!user) {
      throw new Error("Usuario no encontrado!");
    }
    //creamos un token de seguridad con crypto para poder adjuntar en el email
    const resetToken = crypto.randomBytes(20).toString("hex");

    //creamos el token como un parametro del user
    user.resetPasswordToken = resetToken;
    //asignamos timepo de vida al token
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    //configuracion para nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.emailAccount,
        pass: config.gmailAppPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    //enviamos el email con el endpoint +token
    const recoverURL = `http://localhost:8080/users/newPassword/${resetToken}`;

    const mailOptionsRecover = {
      from: config.emailAccount,
      to: user.email,
      subject: "Recupera tu contraseña en SuperMarket",
      text: `Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: ${recoverURL}`,
      html: `<p>Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: <a href="${recoverURL}">restablecer contraseña</a></p>`,
    };

    await transporter.sendMail(mailOptionsRecover);
    return;
  };

  /*========================
  -      BUSCAR USUARIO     -
  ==========================*/
  findByToken = async (token) => {
    const user = await userModel.findOne(token);

    if (!user) {
      throw new Error("Usuario no encontrado!");
    }
    return user;
  };

  /*========================
  -      VALIDAR TOKEN     -
  ==========================*/
  //la validacion del token primero lo busca, y si lo encuentra se fija el tiempo de vida del mismo
  getEmailToken = async ({ resetPasswordToken }) => {
    let readToken = await userModel.findOne({ resetPasswordToken });
    const timer = readToken.resetPasswordExpires;
    console.log("las puertas de Durin, Señor de Moria, habla amigo y entra");
    const result = readToken && timer > Date.now() ? "mellon" : "orc";
    return result;
  };

  /*========================
  -      NUEVA PASSWORD      -
  ==========================*/
  updatePassword = async (userPassword) => {
    try {
      let { nueva, confirmar, token } = userPassword;
      const user = await userModel.findOne({ resetPasswordToken: token });

      if (!user) {
        return { error: "Usuario no encontrado" };
      }
      //comparo que las contraseñas que ingreso el usuario sean iguales
      if (nueva !== confirmar) {
        return { error: "Las contraseñas no coinciden" };
      }
      //comparo la contraseña encriptada con bcrypt y la contraseña que ingresa el usuario
      //si la contreseña ya fue utilizada no te deja usarala
      let notAuthorized = await comparePasswords(nueva, user.password);

      if (notAuthorized) {
        return {
          error: "Contraseña no pudo ser actualizada",
          payload: user.email,
        };
      }
      //si paso las validaciones actualiza password con bcrypt
      user.password = createHash(nueva);
      await user.save();

      return { success: "Contraseña actualizada con éxito", user };
    } catch (error) {
      console.error("Error en UserService -> updatePassword", error);
      throw error;
    }
  };
}
