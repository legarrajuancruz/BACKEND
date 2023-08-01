import { promises as fs } from "fs";

class ProductManager {
  constructor() {
    this.path = "./Products.json";
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

    await fs.writeFile(this.path, JSON.stringify(busqueda, null, 2, `\t`));
  };
}
const productos = new ProductManager();

//productos.addProduct("Miel", "liquida", 500, "sin imagen", "abc123", 10);
//productos.addProduct("Leche", "entera", 300, "sin imagen", "abc123", 15);
//productos.addProduct("Mermelada", "Ciruela", 200, "sin imagen", "abc123", 25);

productos.getProducts();

productos.getProductById(1);

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

//productos.deleteProductById(2);
