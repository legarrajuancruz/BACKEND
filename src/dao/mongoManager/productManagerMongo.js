import { ProductsModel } from "../models/products.model.js";

export default class ProductService {
  constructor() {
    console.log("Products with Database persistence in mongodb");
  }

  crearProducto = async (productoNuevo) => {
    let result = await ProductsModel.create(productoNuevo);
    return result;
  };

  leerProductos = async () => {
    // let { limit, page, query, sort } = params;
    // limit = limit ? limit : 10;
    // page = page ? page : 1;
    // page = query ? query : "";
    // page = sort ? (sort == "asc" ? 1 : -1) : 0;

    // console.log("NUMERO PAGE");
    // console.log(page);

    // let products = await ProductsModel.paginate(query, {
    //   limit: limit,
    //   page: page,
    //   sort: { price: sort },
    // });

    let products = await ProductsModel.find();
    return products;
  };

  getProductbyId = async (id) => {
    return await ProductsModel.findById(id);
  };

  borrarProducto = async ({ id }) => {
    let productoBorrado = await ProductsModel.deleteOne({ id });
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
