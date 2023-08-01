import { promises as fs } from "fs";

export default class ProductManager {
  constructor() {
    this.path = "src/Products.json";
    this.products = [];
  }
  static id = 0;

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    ProductManager.id++;

    let newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: ProductManager.id,
    };
    this.products.push(newProduct);

    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2, `\t`));
  };

  getProducts = async () => {
    let respuesta = await fs.readFile(this.path, "utf-8");

    console.log("LECTUTA DE product.json");
    console.log(respuesta);

    console.log("CONVERSION A OBJ");
    let OBJ = JSON.parse(respuesta);
    console.log(OBJ);
  };

  readProducts = async () => {
    let respuesta = await fs.readFile(this.path, "utf-8");
    return JSON.parse(respuesta);
  };

  getProductById = async (id) => {
    let respuesta = await fs.readFile(this.path, "utf-8");
    let conversionOBJ = JSON.parse(respuesta);
    let busqueda = conversionOBJ.find((eL) => eL.id === id);

    if (busqueda) {
      console.log("*** PRODUCTO ENCONTRADO ***");
      console.log(busqueda);
    } else console.log("PRODUCTO NO ENCONTRADO");
  };

  deleteProductById = async (id) => {
    let respuesta = await fs.readFile(this.path, "utf-8");
    let conversionOBJ = JSON.parse(respuesta);

    let busquedaFiltrada = conversionOBJ.filter((eL) => eL.id != id);
    console.log("PRODUCTO ELIMINADO");
    console.log(busquedaFiltrada);

    await fs.writeFile(
      this.path,
      JSON.stringify(busquedaFiltrada, null, 2, `\t`)
    );
  };

  updateProduct = async (id, nuevo) => {
    let respuesta = await fs.readFile(this.path, "utf-8");
    let parseado = JSON.parse(respuesta);

    let busquedaFiltrada = parseado.filter((eL) => eL.id != id);

    console.log("NUEVO ARRAY");
    let modificado = [{ ...nuevo, id: id }, ...busquedaFiltrada];
    console.log(modificado);

    //await fs.writeFile(this.path, JSON.stringify(modificado, null, 2, `\t`));
  };
}
const productos = new ProductManager();

// productos.addProduct("Miel", "liquida", 500, "sin imagen", "abc123", 10);
// productos.addProduct("Leche", "entera", 300, "sin imagen", "abc123", 15);
// productos.addProduct("Mermelada", "Ciruela", 200, "sin imagen", "abc123", 25);
// productos.addProduct("Azucar", "Chango", 250, "sin imagen", "abc123", 35);
// productos.addProduct("Mayonesa", "Hellmas", 550, "sin imagen", "abc123", 13);
// productos.addProduct("Carne", "Vacuna", 750, "sin imagen", "abc123", 11);
// productos.addProduct("Choclos", "Naturales", 450, "sin imagen", "abc123", 23);
// productos.addProduct("Cocacola", "Zero", 250, "sin imagen", "abc123", 33);
// productos.addProduct("Atun", "Noruego", 150, "sin imagen", "abc123", 63);
// productos.addProduct("Whiskas", "Sarnida", 450, "sin imagen", "abc123", 53);

//productos.getProducts();

//productos.getProductById(1);
//productos.deleteProductById(2);

//let reemplazo = {
//  title: "Cocacola",
//  description: "Light",
//  price: 200,
//  thumbnail: "sin imagen",
//  code: "abc123",
//  stock: 25,
//  id: 3,
//};

//productos.updateProduct(1, reemplazo);
