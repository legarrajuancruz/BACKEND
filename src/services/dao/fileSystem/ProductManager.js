import { promises as fs } from "fs";

class ProductManager {
  constructor() {
    this.path = "./src/dao/fileSystem/dbjson/products.json";
  }

  /*==========
- READ JSON  -
============*/
  readProducts = async () => {
    let products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  /*============
-  WRITE JSON  -
==============*/
  writeProducts = async (product) => {
    await fs.writeFile(this.path, JSON.stringify(product));
  };

  /*=============
- ADD Products  -
===============*/
  crearProducto = async (product) => {
    let productsOld = await this.readProducts();
    product.id = productsOld.length;

    let productAll = [...productsOld, product];
    await this.writeProducts(productAll);

    return "Producto agregado";
  };

  /*=============
- GET Products  -
===============*/
  leerProductos = async () => {
    return await this.readProducts();
  };

  /*================
- GET Products ID -
==================*/
  getProductbyId = async (id) => {
    let busquedaById = await this.existe(id);
    if (!busquedaById) {
      return "Producto no encontrado";
    } else {
      return busquedaById;
    }
  };

  /*================
- EXISTE Producto ? -
==================*/
  existe = async (id) => {
    let products = await this.readProducts();
    return products.find((eL) => eL.id === id);
  };

  /*================
-     DELETE Id     -
==================*/
  borrarProducto = async (id) => {
    let products = await this.readProducts();
    let busquedaId = products.some((eL) => eL.id === id);

    if (busquedaId) {
      let filtrados = products.filter((eL) => eL.id != id);
      await this.writeProducts(filtrados);
      return `Producto eliminado`;
    }
    return "Producto no existe";
  };

  /*================
-     UPDATE Id     -
==================*/
  actualizarProducto = async (id, nuevo) => {
    let parseado = await this.readProducts();
    let productoExiste = await this.existe(id);

    if (!productoExiste) {
      return "Producto no existe";
    } else {
      let busquedaFiltrada = parseado.filter((eL) => eL.id != id);

      let modificado = [{ ...nuevo, id: id }, ...busquedaFiltrada];

      await fs.writeFile(this.path, JSON.stringify(modificado, null, 2, `\t`));

      return `Producto actualizado`;
    }
  };
}

export default ProductManager;
