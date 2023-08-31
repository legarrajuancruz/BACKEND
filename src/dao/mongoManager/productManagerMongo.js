import { ProductsModel } from "../models/products.model.js";

export default class ProductService {
  constructor() {
    console.log("Products with Database persistence in mongodb");
  }

  crearProducto = async (productoNuevo) => {
    let result = await ProductsModel.create(productoNuevo);
    console.log(result);
    return result;
  };

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

  getProductbyId = async (id) => {
    return await ProductsModel.findById(id);
  };

  borrarProducto = async (id) => {
    let productoBorrado = await ProductsModel.deleteOne({ _id: id });
    return productoBorrado;
  };

  actualizarProducto = async (id, productUpdated) => {
    let productoActualizado = await ProductsModel.updateOne(
      { _id: id },
      productUpdated
    );
    return productoActualizado;
  };
}
