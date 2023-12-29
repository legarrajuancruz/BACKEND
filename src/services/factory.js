import config from "../config/config.js";
import singleton from "../config/singleton.js";

let productService;
let cartService;
let userService;

async function initMongoDB() {
  try {
    await singleton.getInstance();

    const { default: productMONGO } = await import(
      "./dao/mongoManager/productManagerMongo.js"
    );
    productService = new productMONGO();
    console.log("Servicio de persistencia de productos en MongoDB");

    ////////////////////

    const { default: cartMONGO } = await import(
      "./dao/mongoManager/cartManagerMongo.js"
    );
    cartService = new cartMONGO();
    console.log("Servicio de persistencia de productos en MongoDB");

    ////////////////////

    const { default: userMONGO } = await import(
      "./dao/mongoManager/userManagerMongo.js"
    );
    userService = new userMONGO();
    console.log("Servicio de persistencia de usuarios en MongoDB");
  } catch (error) {
    console.error("Error al iniciar mongoDB", error);
    process.exit(1);
  }
}

switch (config.persistence) {
  case "mongoDB":
    initMongoDB();
    break;

  case "fileSystem":
    const { default: productFS } = await import(
      "./dao/fileSystem/ProductManager.js"
    );
    productService = new productFS();
    console.log("Servicio de persistencia de productos en FileSystem");

    const { default: cartFS } = await import("./dao/fileSystem/CartManager.js");
    cartService = new cartFS();
    console.log("Servicio de persistencia de productos en FileSystem");

    const { default: userFS } = await import("./dao/fileSystem/userManager.js");
    userService = new userFS();
    console.log("Servicio de persistencia de usuarios en FileSystem");

    break;

  default:
    console.error("Metodo de persistencia invalido o inexistente");
    process.exit(1);
}

export { productService, cartService, userService };
