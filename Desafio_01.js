//ALUMNO: Legarra Juan Cruz
//Desafio01 BACKEND

class ProductManager {
  constructor() {
    this.products = [];
  }

  static id = 0;

  addProduct(title, description, price, thumbnail, code, stock, id) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].code === code) {
        console.log(`El codigo ${code} esta repetido`);
        break;
      }
    }

    ProductManager.id++;

    this.products.push({
      title,
      description,
      price,
      thumbnail: "Sin Imagen",
      code,
      stock,
      id: ProductManager.id,
    });
  }

  getProduct() {
    return this.products;
  }

  getProductById(id) {
    if (!this.products.find((buscarProducto) => buscarProducto.id === id)) {
      console.log("Producto no encontrado");
    } else {
      console.log("\n***[ Producto Encontrado ]***");
      console.log(
        this.products.find((buscarProducto) => buscarProducto.id === id)
      );
    }
  }
}

const productos = new ProductManager();

let vacio = productos.getProduct();
console.log(vacio);

productos.addProduct(
  "Mayonesa",
  "Hellmans",
  250,
  "thumbnail",
  "abc123",
  15,
  ProductManager.id
);

productos.addProduct(
  "Miel",
  "Liquida",
  550,
  "thumbnail",
  "abc123",
  22,
  ProductManager.id
);

console.log(productos.getProduct());

//Buscar producto por indice en arreglo
productos.getProductById(2);
