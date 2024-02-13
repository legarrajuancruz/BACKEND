import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const productAll = new ProductManager();

class CartManager {
  constructor() {
    this.path = "./src/dao/fileSystem/dbjson/carts.json";
  }

  /*==================
  - READ CARTS JSON  -
  ==================*/
  readCarts = async () => {
    let carts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(carts);
  };

  /*==================
  - WRITE CARTS JSON -
  ==================*/
  writeCarts = async (carts) => {
    await fs.writeFile(this.path, JSON.stringify(carts));
  };

  /*===============
  -   ADD Carts   -
  ================*/
  addCarts = async (cart) => {
    let cartsOld = await this.readCarts();

    let id = nanoid();

    let cartAll = [{ id: id, products: [] }, ...cartsOld];

    await this.writeCarts(cartAll);

    return "Carrito agregado";
  };

  /*==============
  -   GET Carts  -
  ===============*/
  getCarts = async () => {
    return await this.readCarts();
  };

  /*================
  -   GET Carts ID  -
  ==================*/
  getCartsById = async (id) => {
    let busquedaById = await this.existe(id);
    if (!busquedaById) {
      return "Carrito no encontrado";
    } else {
      return busquedaById;
    }
  };
  /*==================
  - EXISTE Carrito ? -
  ==================*/
  existe = async (id) => {
    let carts = await this.readCarts();
    return carts.find((eL) => eL.id === id);
  };

  /*=================
    -     DELETE Id    -
    ==================*/
  deleteById = async (id) => {
    let cart = await this.readCarts();
    let busquedaId = cart.some((eL) => eL.id === id);

    if (busquedaId) {
      let filtrados = cart.filter((eL) => eL.id != id);
      await this.writeCarts(filtrados);
      return `Producto eliminado`;
    }
    return "Producto no existe";
  };

  /*==========================
  -   ADD Products to Cart   -
  ==========================*/

  addProductToCart = async (cartId, productId) => {
    let cartsById = await this.existe(cartId);
    if (!cartsById) return "Carrito no encontrado";
    let productById = await productAll.existe(productId);
    if (!productById) return "Producto no encontrado";

    let cartsAll = await this.readCarts();
    let cartFilter = cartsAll.filter((eL) => eL.id != cartId);

    if (cartsById.products.some((eL) => eL.id === productId)) {
      let moreProductsInCart = cartsById.products.find(
        (eL) => eL.id === productId
      );
      moreProductsInCart.cantidad++;

      let cartsConcat = [cartsById, ...cartFilter];
      await this.writeCarts(cartsConcat);
      return "Producto sumado con exito";
    }

    cartsById.products.push({ id: productById.id, cantidad: 1 });
    let cartsConcat = [cartsById, ...cartFilter];
    await this.writeCarts(cartsConcat);
    return "Producto agregado al carrito";
  };
}

export default CartManager;
