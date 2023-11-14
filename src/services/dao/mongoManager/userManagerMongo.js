import userModel from "../models/user.model.js";
import { createHash } from "../utils.js";

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

  /*========================
  -      RESET PASSWORD      -
  ==========================*/
  emailResetPassword = async (userEmail) => {
    const user = await userModel.findOne(userEmail);

    if (!user) {
      throw new Error("Usuario no encontrado!");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    console.log("USUARIO EMAIL RESET");
    console.log(user);

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

  findByToken = async (token) => {
    const user = await userModel.findOne(token);

    if (!user) {
      throw new Error("Usuario no encontrado!");
    }
    return user;
  };

  getEmailToken = async ({ resetPasswordToken }) => {
    let readToken = await userModel.findOne({ resetPasswordToken });

    const timer = readToken.resetPasswordExpires;
    console.log("las puertas de Durin, Señor de Moria, habla amigo y entra");
    if (readToken && timer > 0) {
      console.log("-  MELLON  -");
      return "mellon";
    } else {
      console.log("NO ERES AMIGO");
      return "orc";
    }
  };

  updatePassword = async (userPassword) => {
    let { nueva, confirmar, token } = userPassword;

    const user = await userModel.findOne({ resetPasswordToken: token });

    console.log("ENCONTRO USUARIO EN UPDATE PASSWORD");
    console.log(user.email);
    if (!user) {
      return { error: "Usuario no encontrado" };
    }
    if (nueva != confirmar) {
      return { error: "Las contraseñas no coinciden" };
    }
    if (user.password != nueva) {
      user.password = createHash(nueva);
      try {
        await user.save();
        return { success: "Contraseña actualizada con éxito", user };
      } catch (error) {
        return { error: "Error al actualizar la contraseña" };
      }
    } else {
      return {
        message:
          "La contraseña nueva es la misma que la actual, no se realizó ninguna actualización",
      };
    }
  };
}
