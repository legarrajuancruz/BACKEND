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

export default program;
