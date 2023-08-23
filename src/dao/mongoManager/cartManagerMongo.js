import CartsModel from "../models/carts.model.js";

export default class CartService {
  constructor() {
    console.log("Carts with Database persistence in mongodb");
  }
  /*===============
  -   ADD Carts   -
  ================*/
  addCarts = async (product) => {
    let result = await CartsModel.create(product);
    return result;
  };

  /*==============
  -   GET Carts  -
  ===============*/
  getCarts = async () => {
    let carts = await CartsModel.find();
    return carts.map((eL) => eL.toObject());
  };

  /*================
  -   GET Carts ID  -
  ==================*/
  getCartsById = async (id) => {
    return await CartsModel.findById(id);
  };

  /*==================
  - EXISTE Carrito ? -
  ==================*/
  existe = async (id) => {
    let carts = await CartsModel.getCarts();
    return carts.find((eL) => eL.id === id);
  };

  /*==================
  -  DELETE CART ID  -
  ==================*/
  deleteCart = async (id) => {
    let result = await CartsModel.deleteOne(id);
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

  addProductToCart = async (cartId, productId) => {
    let result = await CartsModel.updateOne({ _id: id }, cartUpdated);
  };
}
