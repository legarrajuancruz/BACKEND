import config from "../config/config.js";

let productService;

switch (config.persistence) {
  case "mongoDB":
    break;

  case "fileSystem":
    break;

  default:
    console.error("Metodo de persistencia invalido o inexistente");
    process.exit(1);
}

export { productService };
