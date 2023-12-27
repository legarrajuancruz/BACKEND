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
describe("Testing products Api", () => {
  let productId;

  // Test 01: Crear producto
  it("Crear producto: el API POST /api/products debe crear un nuevo producto", async () => {
    const productMock = {
      title: "testing",
      description: "testing",
      price: 0,
      stock: 25,
      category: "Test",
      owner: "6589e9f644c0d86ae342f5ff", // Ajusta esto con un ID de usuario válido
    };

    const imagePath = path.join(__dirname, "../src/uploads/products/test.png");

    // Adjunta el archivo de imagen a la solicitud
    const response = await requester
      .post("/api/products")
      .field("title", productMock.title)
      .field("description", productMock.description)
      .field("price", productMock.price.toString())
      .field("stock", productMock.stock.toString())
      .field("category", productMock.category)
      .field("owner", productMock.owner)
      .attach("img", fs.readFileSync(imagePath), "testing.jpg");

    expect(response.status).to.eql(201);
    expect(response.body.result).to.eql("Producto creado con exito");
    expect(response.body.producto).to.be.an("object");
    expect(response.body.producto).to.have.property("_id");

    productId = response.body.producto._id;
  });
  // Test 02: Obtener todos los productos
  it("Obtener todos los productos: el API GET /api/products debe devolver una lista de productos", async () => {
    const response = await requester.get("/api/products");

    expect(response.status).to.eql(200);
    expect(response.body.result).to.eql("Productos obtenidos con exito");
    expect(response.body.Productos)
      .to.have.property("payload")
      .that.is.an("array");
  });
  // Test 03: Obtener un producto por ID
  it("Obtener un producto por ID: el API GET /api/products/:id debe devolver un producto específico", async () => {
    const response = await requester.get(`/api/products/${productId}`);

    expect(response.status).to.eql(202); // Cambiado de 202 a 200
    expect(response.body.result).to.eql("Producto obtenido con exito");
    expect(response.body.producto).to.be.an("object");
    expect(response.body.producto).to.have.property("_id", productId);
  });
  // Test 04: Actualizar un producto
  it("Actualizar un producto: el API PUT /api/products/:id debe actualizar un producto existente", async () => {
    const updatedProduct = {
      title: "producto actualizado",
      description: "producto actualizado",
      price: 500,
      stock: 25,
      category: "test",
      owner: "6589e9f644c0d86ae342f5ff",
    };
    const imagePath = path.join(
      __dirname,
      "../src/uploads/products/modified.jpg"
    );

    const response = await requester
      .put(`/api/products/${productId}`)
      .field("title", updatedProduct.title)
      .field("description", updatedProduct.description)
      .field("price", updatedProduct.price.toString())
      .field("stock", updatedProduct.stock.toString())
      .field("category", updatedProduct.category)
      .field("owner", updatedProduct.owner)
      .attach("img", fs.readFileSync(imagePath), "modified.jpg");

    expect(response.status).to.eql(202);
    expect(response.body.result).to.eql("Producto modificado con exito");
    expect(response.body.payload).to.be.an("object");
  });
  // Test 05: Eliminar un producto
  it("Eliminar un producto: el API DELETE /api/products/:id debe eliminar un producto existente", async () => {
    // Crear un nuevo producto para ser eliminado
    const productMock = {
      title: "Producto a Eliminar",
      description: "Descripción del producto a eliminar",
      price: 100,
      stock: 10,
      category: "Test",
      owner: "6589e9f644c0d86ae342f5ff", // Ajusta esto con un ID(admin) de usuario válido
    };

    const imagePath = path.join(
      __dirname,
      "../src/uploads/products/modified.jpg"
    );

    const createResponse = await requester
      .post("/api/products")
      .field("title", productMock.title)
      .field("description", productMock.description)
      .field("price", productMock.price)
      .field("stock", productMock.stock)
      .field("category", productMock.category)
      .field("owner", productMock.owner)
      .attach("img", fs.readFileSync(imagePath), "modified.jpg");

    expect(createResponse.status).to.eql(201);
    expect(createResponse.body.result).to.eql("Producto creado con exito");
    expect(createResponse.body.producto).to.be.an("object");
    expect(createResponse.body.producto).to.have.property("_id");

    const productId = createResponse.body.producto._id;

    // Eliminar el producto recién creado
    const deleteResponse = await requester
      .delete(`/api/products/${productId}`)
      .send({ _id: productId, uid: "6589e9f644c0d86ae342f5ff" }); // Ajusta el ID de usuario según tus necesidades

    expect(deleteResponse.status).to.eql(203);
    expect(deleteResponse.body.result).to.eql(
      "Producto eliminado por ADMIN con exito"
    );
    expect(deleteResponse.body.payload).to.be.an("object");
    expect(deleteResponse.body.payload).to.have.property("_id", productId);
  });

  // /*======================
  // =       SECTION 02     =
  // =======================*/
  describe("Testing Cart API", () => {
    let cartId; // asignacion de carrito
    let productId; // producto en base de datos

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

      if (getCartsResponse.body.Carritos.length === 0) {
        // Si la lista de carritos esta vacia, la respuesta debe tener un estado 404
        expect(getCartsResponse.status).to.eql(404);
        expect(getCartsResponse.body.result).to.eql(
          "No se encontraron carritos"
        );
      } else {
        // Si hay carritos, la respuesta debe tener un estado 202 y la lista no debe estar vacia
        expect(getCartsResponse.status).to.eql(202);
        expect(getCartsResponse.body.result).to.eql(
          "Carrito obtenido con éxito"
        );
        expect(getCartsResponse.body.Carritos).to.be.an("array").that.is.not
          .empty;
      }
    });

    // Test 03: Obtener carritos por ID
    it("Obtener un carrito por ID: el API GET /api/carts/:id debe devolver un carrito específico", async () => {
      // Asegurate de tener un cartId valido, por ejemplo, obteniéndolo de la creacion de un carrito
      const carrito = cartId;

      const getCartsByIdResponse = await requester.get(`/api/carts/${carrito}`);

      if (getCartsByIdResponse.status === 404) {
        // Si no se encuentra el carrito, la respuesta debe tener un estado 404
        expect(getCartsByIdResponse.status).to.eql(404);
        expect(getCartsByIdResponse.body.result).to.eql(
          "No se encontró el carrito"
        );
      } else {
        // Si se encuentra el carrito, la respuesta debe tener un estado 202 y el carrito debe ser un objeto con la propiedad _id igual a cartId
        expect(getCartsByIdResponse.status).to.eql(202);
        expect(getCartsByIdResponse.body.result).to.eql(
          "Carrito obtenido con exito"
        );
        expect(getCartsByIdResponse.body.carrito).to.be.an("array").that.is.not
          .empty;

        const cart = getCartsByIdResponse.body.carrito[0];
        expect(cart).to.have.property("_id", carrito);
      }
    });

    // Test 04: Agregar producto al carrito
    it("Agregar producto al carrito: el API POST /api/carts/:cid/products/:pid debe agregar un producto al carrito", async () => {
      // Agregar un producto al carrito con una cantidad específica
      const addProductToCartResponse = await requester
        .post(`/api/carts/${cartId}/products/${"6589efc94fa38a3da3328a6a"}`)
        .send({ quantity: 2 });

      // Verificar el estado de la respuesta
      expect(addProductToCartResponse.status).to.eql(202);
      expect(addProductToCartResponse.body.result).to.eql(
        "Carrito modificado con exito"
      );
    });

    // Test 05: Modificar cantidad de productos en el carrito
    it("Modificar cantidad de productos en el carrito: el API PUT /api/carts/:cid debe modificar la cantidad de productos en el carrito", async () => {
      const productsToUpdate = [
        { _id: "6589efc94fa38a3da3328a6a", quantity: 1 },
      ];

      const modProductsInCartResponse = await requester
        .put(`/api/carts/${cartId}`)
        .send(productsToUpdate);

      // Verificar el estado de la respuesta
      expect(modProductsInCartResponse.status).to.eql(200);
      expect(modProductsInCartResponse.body.status).to.eql("success");
      expect(modProductsInCartResponse.body.newCart).to.be.an("object");
      expect(modProductsInCartResponse.body.newCart.products).to.be.an("array");

      // Verificar que los productos se hayan actualizado correctamente en el carrito
      const updatedProducts = modProductsInCartResponse.body.newCart.products;

      for (const updatedProduct of updatedProducts) {
        const expectedProduct = productsToUpdate.find(
          (product) => product._id === updatedProduct._id
        );

        expect(updatedProduct).to.have.property(
          "quantity",
          expectedProduct.quantity
        );
      }
    });

    // Test 06: Eliminar producto del carrito
    it("Eliminar producto del carrito: el API DELETE /api/carts/:cid/products/:pid debe eliminar un producto del carrito", async () => {
      const productIdToDelete = "6589efc94fa38a3da3328a6a";
      const deleteProductInCartResponse = await requester.delete(
        `/api/carts/${cartId}/products/${productIdToDelete}`
      );

      // Verificar el estado de la respuesta
      expect(deleteProductInCartResponse.status).to.eql(202);
      expect(deleteProductInCartResponse.body.result).to.eql(
        "Carrito modificado con exito"
      );
      expect(deleteProductInCartResponse.body.Carrito).to.be.an("object");
    });

    // Test 07: Eliminar carrito
    it("Crear y eliminar carrito: el API POST /api/carts debe crear un nuevo carrito y el API DELETE /api/carts/:id debe eliminarlo", async () => {
      // Paso 1: Crear un nuevo carrito pata testear el delete
      const createCartResponse = await requester.post("/api/carts");
      expect(createCartResponse.status).to.equal(201);
      expect(createCartResponse.body.result).to.equal(
        "Carrito creado con exito"
      );
      expect(createCartResponse.body.carrito).to.have.property("_id");

      const cartIdToDelete = createCartResponse.body.carrito._id;

      // Paso 2: Eliminar el carrito recién creado
      const deleteCartResponse = await requester.delete(
        `/api/carts/${cartIdToDelete}`
      );

      expect(deleteCartResponse.status).to.equal(202);
      expect(deleteCartResponse.body.result).to.equal(
        "Carrito eliminado con exito"
      );
    });
  });

  // /*======================
  // =       SECTION 03     =
  // =======================*/

  describe("Testing Sessions API", () => {
    // Test 01: Prueba de inicio de sesión exitoso
    it("Inicio de sesión exitoso y devuelve token", async () => {
      const response = await requester.post("/api/sessions/login").send({
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      });

      expect(response.status).to.equal(201); // Ajusta según tu lógica
      expect(response.body).to.have.property("access_token");
    });

    // // Test 02: Prueba de inicio de sesión fallido (credenciales incorrectas)
    it("Inicio de sesión fallido para credenciales incorrectas y devuelve 401", async () => {
      const response = await requester.post("/api/sessions/login").send({
        email: "correo@incorrecto.com",
        password: "contraseñaincorrecta",
      });
      expect(response.status).to.equal(401);
    });

    // // Test 03: Prueba de registro exitoso
    it("Registro exitoso y devuelve 201", async () => {
      const response = await requester.post("/api/sessions/register").send({
        first_name: "testing",
        last_name: "testing",
        email: "testing@testing.com",
        age: 25,
        password: "testing",
      });

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal({
        status: "success",
        message: "Usuario creado con exito",
      });
    });

    // Test 04: Prueba de registro fallido (usuario ya existente)
    it("Registro fallido para usuario existente y devuelve 400", async () => {
      const response = await requester.post("/api/sessions/register").send({
        first_name: "testing",
        last_name: "testing",
        email: "testing@testing.com", //este usuario ya existe
        age: 25,
        password: "testing",
      });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("status", "error");
      expect(response.body).to.have.property(
        "message",
        "Usuario ya registrado"
      );
    });
  });
});
