import nodemailer from "nodemailer";
import crypto from "crypto";
import { userModel } from "../dao/models/user.model.js";
import { emailAccount, gmailAppPassword } from "../config/config.js";

//FUNCION ENVIAR MAIL RECUPERAR CONTRASEÑA
const recoverPassword = async (userEmail) => {
  const user = await userModel.findOne({ email: userEmail });
  if (!user) {
    throw new Error("Usuario no encontrado!");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: emailAccount,
      pass: gmailAppPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const recoverURL = `http://localhost:8080/newPassword/${resetToken}`;

  const mailOptionsRecover = {
    from: emailAccount,
    to: userEmail,
    subject: "Recupera tu contraseña en PokeShop",
    text: `Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: ${recoverURL}`,
    html: `<p>Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: <a href="${recoverURL}">restablecer contraseña</a></p>`,
  };

  await transporter.sendMail(mailOptionsRecover);
};

export default recoverPassword;
