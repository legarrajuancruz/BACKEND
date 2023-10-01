import dotenv from "dotenv";

const enviroment = "production";

dotenv.config({
  path:
    enviroment === "production"
      ? "./src/config/.env.production"
      : "./src/config/.env.development",
});

export default {
  port: process.env.PORT,
  mongoUrl: process.env.URL_MONGO,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
};
