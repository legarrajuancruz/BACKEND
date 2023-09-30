import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.URL_MONGO,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
};
