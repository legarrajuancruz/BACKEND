import config from "../config/config.js";
import singleton from "../config/singleton.js";

let ProductService;
let CartService;

async function initMongoDB() {
  try {
    await singleton.getInstance();

    const { default: productMONGO } = await import(
      "./dao/mongoManager/productManagerMongo.js"
    );
    ProductService = new productMONGO();
    console.log("Servicio de persistencia de productos en MongoDB");

    // const { default: cartMONGO } = await import(
    //   "./dao/mongoManager/cartManagerMongo.js"
    // );
    // CartService = new cartMONGO();
    // console.log("Servicio de persistencia de productos en MongoDB");
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
    ProductService = new productFS();
    console.log("Servicio de persistencia de productos en FileSystem");

    const { default: cartFS } = await import("./dao/fileSystem/CartManager.js");
    CartService = new cartFS();
    console.log("Servicio de persistencia de productos en FileSystem");

    break;

  default:
    console.error("Metodo de persistencia invalido o inexistente");
    process.exit(1);
}

export { ProductService, CartService };
