import { ProductsModel } from "../models/products.model.js";

export default class ProductService {
  constructor() {
    console.log("Products with Database persistence in mongodb");
  }

  /*==============================
  -      CREAR NUEVO PRODUCTO    -
  ==============================*/
  crearProducto = async (productoNuevo) => {
    let result = await ProductsModel.create(productoNuevo);
    return result;
  };

  /*========================
  -      LEER PRODUCTOS     -
  ==========================*/
  getProducts = async () => {
    const productos = await ProductsModel.find();
    return productos;
  };

  /*=====================================
  -      LEER PRODUCTOS CON PAGINATE     -
  ======================================*/
  leerProductos = async (obj) => {
    let { limit, page, query, sort } = obj;

    limit = limit ? limit : 10;
    page = page ? page : 1;
    query = query || {};
    sort = sort ? (sort == "asc" ? 1 : -1) : 0;
    let products = await ProductsModel.paginate(query, {
      limit: limit,
      page: page,
      sort: { price: sort },
    });

    let status = products ? "success" : "error";

    let prevLink = products.hasPrevPage
      ? "http://localhost:8080/products?limit=" +
        limit +
        "&page=" +
        products.prevPage
      : null;

    let nextLink = products.hasNextPage
      ? "http://localhost:8080/products?limit=" +
        limit +
        "&page=" +
        products.nextPage
      : null;

    products = {
      status: status,
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    };

    return products;
  };

  /*===============================
  -      LEER PRODUCTOS POR ID     -
  ================================*/
  getProductbyId = async (id) => {
    const product = await ProductsModel.findById(id);
    return product;
  };

  /*========================
  -      BORRAR PRODUCTO    -
  ==========================*/
  borrarProducto = async (id) => {
    const product = await ProductsModel.findById(id);
    console.log(product.owner.role);
    let productoBorrado = await ProductsModel.deleteOne({ _id: id });
    return productoBorrado;
  };

  /*================================
  -      ACTUALIZAR PRODUCTO     -
  ==============================*/
  actualizarProducto = async (id, productUpdated) => {
    console.log(id, productUpdated);
    let productoActualizado = await ProductsModel.updateOne(
      { _id: id },
      productUpdated
    );
    return productoActualizado;
  };
}
