import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program
  .option("-d", "Variable para debug", false)
  .option("-p <port>", "Puerto del server", 8080)
  .option("--persist <mode>", "Modo de persistencia", "mongoDB")
  .option("--mode <mode>", "Modo de trabajo", "develop")
  .option(
    "-u <user>",
    "Usuario que utiliza el aplicativo",
    "No se declaro ningun usuario"
  );
program.parse();

console.log("Options", program.opts());
console.log("Modo Opt: ", program.opts().mode);
console.log("Modo persistencia", program.opts().persist);
console.log("Remaining arguments: ", program.args);

const environment = program.opts().mode;

dotenv.config({
  path:
    environment === "production"
      ? "./config/.env.production"
      : "./config/.env.development",
});

export default {
  port: process.env.PORT,
  mongoUrl: process.env.URL_MONGO,
  emailAccount: process.env.GMAIL_ACCOUNT,
  gmailAppPassword: process.env.GMAIL_APP_PASSWD,
  persistence: program.opts().persist,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  environment: environment,
};
