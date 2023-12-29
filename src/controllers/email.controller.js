import nodemailer from "nodemailer";
import config from "../config/config.js";
import __dirname from "../utils.js";

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

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server email esta listo");
  }
});

const mailOptions = {
  from: "Coder" + config.emailAccount,
  to: config.emailAccount,
  subject: "Coreeo test Backend",
  html: `<div> 
            <h1>TEST EMAIL</h1>
        </div>`,
  attachament: [],
};

export const sendEmail = (req, res) => {
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ msg: "error", payload: error });
      }
      console.log("Message sent: %s", info.messageId);
      res.send({ message: "success", payload: info });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error,
      message: "No se pudo enviar el email" + config.gmailAccount,
    });
  }
};

const mailOptionsWithAttachments = {
  from: "Coder" + config.emailAccount,
  to: config.emailAccount,
  subject: "Coreeo test Backend",
  html: `<div> 
            <h1>TEST EMAIL</h1>            
        </div>`,
  attachament: [
    {
      filename: "ImagenProgramacion.jpeg",
      path: __dirname + "/public/img/creado.jpeg",
      cid: "creado",
    },
  ],
};

export const sendEmailWithAttachements = (req, res) => {
  try {
    transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ msg: "error", payload: error });
      }
      console.log("Message sent: %s", info.messageId);
      res.send({ message: "success", payload: info });
    });
  } catch (error) {
    res.status(500).send({
      error: error,
      message: "No se pudo enviar el email" + config.gmailAccount,
    });
  }
};
