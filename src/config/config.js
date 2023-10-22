import dotenv from "dotenv";
import program from "../process.js";

const enviroment = program.opts().mode;

dotenv.config({
  path:
    enviroment === "development"
      ? "./src/config/.env.production"
      : "./src/config/.env.development",
});

export default {
  port: process.env.PORT,
  mongoUrl: process.env.URL_MONGO,
  emailAccount: process.env.GMAIL_ACCOUNT,
  gmailAppPassword: process.env.GMAIL_PP_PASSWD,
  persistence: program.opts().persist,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
};
