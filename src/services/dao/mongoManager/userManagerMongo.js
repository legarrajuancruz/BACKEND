import userModel from "../models/user.model.js";
import {
  createHash,
  isValidPassword,
  comparePasswords,
} from "../../../utils.js";
import usersDto from "../../dto/users.dto.js";
import config from "../../../config/config.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

class UserService {
  constructor() {
    console.log("Users with Database persistence in mongodb");
  }
  /*===================
  -      GET USERS     -
  ====================*/
  getUsers = async () => {
    let allUsers = await userModel.find();
    const simplifiedUsers = allUsers.map((user) => new usersDto(user));
    return simplifiedUsers;
  };

  /*========================
  -      GET USER BY ID     -
  ==========================*/
  getUserByID = async (id) => {
    let usuarioEncontrado = await userModel.findById(id);
    return usuarioEncontrado;
  };

  /*========================
  -      CREAR AUSUARIO     -
  ==========================*/
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
  /*==========================
  -    LOGIN DE USUARIO     -
  ==========================*/
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

  /*==========================
  -    CAMBIAR ROL USUARIO    -
  ===========================*/
  changeRol = async (id, newRole) => {
    try {
      const userUpdated = await userModel.findByIdAndUpdate(
        id,
        { role: newRole },
        { new: true }
      );

      return userUpdated;
    } catch (error) {
      console.error(`Error al actualizar el rol del usuario`, error.message);
      throw error;
    }
  };

  /*===========================
  -      BORRAR USUARIO     -
  ==========================*/
  deleteUser = async (id) => {
    try {
      const userDeleted = await userModel.findByIdAndRemove(id);
      return userDeleted;
    } catch (error) {
      console.error(`Error al borrar el usuario`, error.message);
      throw error;
    }
  };

  /*========================
  -      LEER USUARIOS     -
  ==========================*/
  leerUsuarios = async ({ email }) => {
    console.log({ email });
    let users = await userModel.findOne({ email });

    return users;
  };

  /*==============================
  -   CARGAR TICKETS EN USUARIO   -
  ===============================*/
  updateUser = async (userId, ticketId) => {
    const user = await userModel.findById(userId);
    if (user) {
      user.orders.push({ ticket: ticketId });
      await user.save();
    }
    return user;
  };

  /*================================
  -   ENVIAR EMAIL RESET PASSWORD  -
  ================================*/
  emailResetPassword = async (userEmail) => {
    console.log("DENTEO DEL SERVICIO");
    console.log(userEmail);
    const user = await userModel.findOne(userEmail);
    console.log("USUARIO ENCONTRADO");
    console.log(user);

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

  /*=================================
  -     BUSCAR USUARIO POR TOKEN    -
  ==================================*/
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

  /*=====================================
    -     BUSCAR USUARIOS INACTIVOS      -
    ====================================*/
  findInactiveUsers = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const inactiveUsers = await userModel.find({
      lastConnection: { $lt: thirtyMinutesAgo.toISOString() },
    });

    return inactiveUsers;
  };
  /*=====================================
    -    ELIMINAR USUARIOS INACTIVOS     -
    ====================================*/
  deleteInactiveUsers = async (inactiveUsers) => {
    const deletedUsers = await userModel.deleteMany({
      _id: { $in: inactiveUsers.map((user) => user._id) },
    });
    return deletedUsers;
  };

  /*=======================================
    -  ENVIAR EMAIL USUARIO ELIMINADO   -
    ====================================*/
  sendNotificationEmails = async (inactiveUsers) => {
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

    for (const user of inactiveUsers) {
      const userEmail = user.email;
      const mailOptionsInactive = {
        from: config.emailAccount,
        to: userEmail,
        subject: "Eliminacion de cuenta por inactividad",
        text: "Tu cuenta ha sido eliminada debido a la inactividad durante los últimos 2 días.",
      };
      await transporter.sendMail(mailOptionsInactive);
    }
  };

  /*=====================================
    -  ENVIAR EMAIL PRODUCTO ELIMINADO   -
    ====================================*/
  sendNotificationProductErased = async (user) => {
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

    const mailOptionErased = {
      from: config.emailAccount,
      to: user,
      subject: "Un producto suyo fue eliminado",
      text: "Uno de sus productos fue eliminado del servidor.",
    };
    const emailSendeed = await transporter.sendMail(mailOptionErased);
    if (emailSendeed) {
      return "true";
    } else {
      return "false";
    }
  };
}
export default UserService;
