import chai from "chai";
import supertest from "supertest";
import fs from "fs";
import * as path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from "path";

const requester = supertest("http://localhost:8080");
const expect = chai.expect;

/*======================
=       SECTION 01     =
=======================*/
// describe("Testing products Api", () => {
//   let productId;

//   // Test 01: Crear producto
//   it("Crear producto: el API POST /api/products debe crear un nuevo producto", async () => {
//     const productMock = {
//       title: "testing",
//       description: "testing",
//       price: 0,
//       stock: 25,
//       category: "Test",
//       owner: "653990f848e406023a7d97cf", // Ajusta esto con un ID de usuario válido
//     };

//     const imagePath = path.join(__dirname, "../src/public/img/test.jpg");

//     // Adjunta el archivo de imagen a la solicitud
//     const response = await requester
//       .post("/api/products")
//       .field("title", productMock.title)
//       .field("description", productMock.description)
//       .field("price", productMock.price)
//       .field("stock", productMock.stock)
//       .field("category", productMock.category)
//       .field("owner", productMock.owner)
//       .attach("img", fs.readFileSync(imagePath), "testing.jpg");

//     expect(response.status).to.eql(201);
//     expect(response.body.result).to.eql("Producto creado con exito");
//     expect(response.body.producto).to.be.an("object");
//     expect(response.body.producto).to.have.property("_id");

//     productId = response.body.producto._id;
//   });

//   const imagePath = path.join(__dirname, "../src/public/img/test.jpg");

//   // Test 02: Obtener todos los productos
//   it("Obtener todos los productos: el API GET /api/products debe devolver una lista de productos", async () => {
//     const response = await requester.get("/api/products");

//     expect(response.status).to.eql(200);
//     expect(response.body.result).to.eql("Productos obtenidos con exito");
//     expect(response.body.Productos)
//       .to.have.property("payload")
//       .that.is.an("array");
//   });

//   // Test 03: Obtener un producto por ID
//   it("Obtener un producto por ID: el API GET /api/products/:id debe devolver un producto específico", async () => {
//     const response = await requester.get(`/api/products/${productId}`);

//     expect(response.status).to.eql(202);
//     expect(response.body.result).to.eql("Producto obtenido con exito");
//     expect(response.body.producto).to.be.an("object");
//     expect(response.body.producto).to.have.property("_id", productId);
//   });

//   // Test 04: Actualizar un producto
//   it("Actualizar un producto: el API PUT /api/products/:id debe actualizar un producto existente", async () => {
//     const updatedProduct = {
//       title: "testingUpdated",
//       description: "testingUpdated",
//       price: 10,
//       stock: 30,
//       category: "Updated",
//     };

//     const response = await requester
//       .put(`/api/products/${productId}`)
//       .send(updatedProduct);

//     expect(response.status).to.eql(202);
//     expect(response.body.result).to.eql("Producto modificado con exito");
//     expect(response.body.payload).to.be.an("object");
//   });

//   // Test 05: Eliminar un producto
//   it("Eliminar un producto: el API DELETE /api/products/:id debe eliminar un producto existente", async () => {
//     // Simular la creación de un nuevo producto para ser eliminado
//     const productMock = {
//       title: "Producto a Eliminar",
//       description: "Descripción del producto a eliminar",
//       price: 100,
//       stock: 10,
//       category: "Test",
//       owner: "653aeeec4905f64e60f50b20", // Ajusta esto con un ID(admin) de usuario válido
//     };

//     const createResponse = await requester
//       .post("/api/products")
//       .field("title", productMock.title)
//       .field("description", productMock.description)
//       .field("price", productMock.price)
//       .field("stock", productMock.stock)
//       .field("category", productMock.category)
//       .field("owner", productMock.owner)
//       .attach("img", fs.readFileSync(imagePath), "testing.jpg");

//     expect(createResponse.status).to.eql(201);
//     expect(createResponse.body.result).to.eql("Producto creado con exito");
//     expect(createResponse.body.producto).to.be.an("object");
//     expect(createResponse.body.producto).to.have.property("_id");

//     const productId = createResponse.body.producto._id;

//     // Simular la eliminación del producto recién creado
//     const deleteResponse = await requester
//       .delete(`/api/products/${productId}`)
//       .send({ _id: productId, uid: "653aeeec4905f64e60f50b20" }); // Ajusta el ID de usuario según tus necesidades

//     expect(deleteResponse.status).to.eql(203);
//     expect(deleteResponse.body.result).to.eql(
//       "Producto eliminado por ADMIN con exito"
//     );
//     expect(deleteResponse.body.payload).to.be.an("object");
//     expect(deleteResponse.body.payload).to.have.property("_id", productId);
//   });
// });

// /*======================
// =       SECTION 02     =
// =======================*/
describe("Testing Cart API", () => {
  let cartId = "656cf5148bfbf66cf87144d1"; // asignacion de carrito
  let productId = "656b470cc6f563b8cee70abe"; // producto en base de datos - fernet

  // Test 01: Crear carrito
  it("Crear carrito: el API POST /api/carts debe crear un nuevo carrito", async () => {
    const createCartResponse = await requester.post("/api/carts");
    expect(createCartResponse.status).to.eql(201);
    expect(createCartResponse.body.result).to.eql("Carrito creado con exito");
    expect(createCartResponse.body.carrito).to.be.an("object");
    expect(createCartResponse.body.carrito).to.have.property("_id");

    cartId = createCartResponse.body.carrito._id;
  });

  // Test 02: Obtener carritos
  it("Obtener todos los carritos: el API GET /api/carts debe devolver una lista de carritos", async () => {
    const getCartsResponse = await requester.get("/api/carts");

    expect(getCartsResponse.status).to.eql(202);
    expect(getCartsResponse.body.result).to.eql("Carrito obtenido con exito");
    expect(getCartsResponse.body.Carritos).to.be.an("array").that.is.not.empty; // Asegurarse de que la lista no esté vacía
  });

  // Test 03: Obtener carritos por ID
  it("Obtener un carrito por ID: el API GET /api/carts/:id debe devolver un carrito específico", async () => {
    const getCartsByIdResponse = await requester.get(`/api/carts/${cartId}`);

    expect(getCartsByIdResponse.status).to.eql(202);
    expect(getCartsByIdResponse.body.result).to.eql(
      "Carrito obtenido con exito"
    );
    expect(getCartsByIdResponse.body.carrito).to.be.an("object");
    expect(getCartsByIdResponse.body.carrito).to.have.property("_id", cartId);
  });

  // Test 04: Agregar producto al carrito
  it("Agregar producto al carrito: el API POST /api/carts/:cid/products/:pid debe agregar un producto al carrito", async () => {
    const addProductToCartResponse = await requester
      .post(`/api/carts/${cartId}/products/${productId}`)
      .send({ quantity: 2 });

    expect(addProductToCartResponse.status).to.eql(202);
    expect(addProductToCartResponse.body.result).to.eql(
      "Carrito modificado con exito"
    );
    expect(addProductToCartResponse.body.Carritos).to.be.an("object");
    expect(addProductToCartResponse.body.Carritos).to.have.property(
      "_id",
      cartId
    );
    expect(addProductToCartResponse.body.Carritos.products).to.be.an("array");
    expect(addProductToCartResponse.body.Carritos.products).to.have.lengthOf(1);
  });

  // Test 05: Modificar cantidad de productos en el carrito
  it("Modificar cantidad de productos en el carrito: el API PUT /api/carts/:cid/products/:pid debe modificar la cantidad de productos en el carrito", async () => {
    const quantityUpdate = 5; // Modifica la cantidad según tus necesidades

    const modProductsInCartResponse = await requester
      .put(`/api/carts/${cartId}/products/${productId}`)
      .send([{ _id: productId, quantity: quantityUpdate }]);

    expect(modProductsInCartResponse.status).to.eql(200);
    expect(modProductsInCartResponse.body.status).to.eql("success");
    expect(modProductsInCartResponse.body.newCart).to.be.an("object");
    //expect(modProductsInCartResponse.body.newCart.products).to.be.an("array");

    const updatedProduct = modProductsInCartResponse.body.newCart.products.find(
      (product) => product._id === productId
    );

    expect(updatedProduct).to.have.property("quantity", quantityUpdate);
  });

  // Test 05: Eliminar producto del carrito
  //   it("Eliminar producto del carrito: el API DELETE /api/carts/:cid/products/:pid debe eliminar un producto del carrito", async () => {
  //     const deleteProductInCartResponse = await requester.delete(
  //       `/api/carts/${cartId}/products/${productId}`
  //     );

  //     expect(deleteProductInCartResponse.status).to.eql(202);
  //     expect(deleteProductInCartResponse.body.result).to.eql(
  //       "Carrito modificado con exito"
  //     );
  //     expect(deleteProductInCartResponse.body.Carrito).to.be.an("object");
  //     expect(deleteProductInCartResponse.body.Carrito).to.have.property(
  //       "_id",
  //       cartId
  //     );
  //     expect(deleteProductInCartResponse.body.Carrito.products).to.be.an("array");
  //     expect(deleteProductInCartResponse.body.Carrito.products).to.have.lengthOf(
  //       0
  //     );
  //   });

  // Test 06: Eliminar carrito

  //   it("Eliminar carrito: el API DELETE /api/carts/:id debe eliminar un carrito existente", async () => {
  //     const deleteCartResponse = await requester.delete(`/api/carts/${cartId}`);

  //     expect(deleteCartResponse.status).to.eql(203);
  //     expect(deleteCartResponse.body.result).to.eql(
  //       "Carrito eliminado con exito"
  //     );
  //     expect(deleteCartResponse.body.payload).to.be.an("object");
  //     expect(deleteCartResponse.body.payload).to.have.property("_id", cartId);
  //   });
});

// /*======================
// =       SECTION 03     =
// =======================*/

// describe("Testing Sessions API", () => {
//   // Prueba de inicio de sesión exitoso
//   it("Inicio de sesión exitoso y devuelve token", async () => {
//     const response = await requester.post("/api/sessions/login").send({
//       email: "adminCoder@coder.com",
//       password: "adminCod3r123",
//     });

//     expect(response.status).to.equal(201); // Ajusta según tu lógica
//     expect(response.body).to.have.property("access_token");
//   });

//   // Prueba de inicio de sesión fallido (credenciales incorrectas)
//   it("Inicio de sesión fallido para credenciales incorrectas y devuelve 401", async () => {
//     const response = await requester.post("/api/sessions/login").send({
//       email: "correo@incorrecto.com",
//       password: "contraseñaincorrecta",
//     });
//     expect(response.status).to.equal(401);
//   });

//   // Prueba de registro exitoso
//   it("Registro exitoso y devuelve 201", async () => {
//     const response = await requester.post("/api/sessions/register").send({
//       first_name: "testing",
//       last_name: "testing",
//       email: "testing@testing.com",
//       age: 25,
//       password: "testing",
//     });

//     expect(response.status).to.equal(201);
//     expect(response.body).to.deep.equal({
//       status: "success",
//       message: "Usuario creado con exito",
//     });
//   });

//   // Prueba de registro fallido (usuario ya existente)
//   it("Registro fallido para usuario existente y devuelve 400", async () => {
//     const response = await requester.post("/api/sessions/register").send({
//       first_name: "testing",
//       last_name: "testing",
//       email: "testing@testing.com", //este usuario ya existe
//       age: 25,
//       password: "testing",
//     });

//     expect(response.status).to.equal(400);
//     expect(response.body).to.have.property("status", "error");
//     expect(response.body).to.have.property("message", "Usuario ya registrado");
//   });
// });
