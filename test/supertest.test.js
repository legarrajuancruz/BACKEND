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
      owner: "653990f848e406023a7d97cf", // Ajusta esto con un ID de usuario válido
    };

    const imagePath = path.join(__dirname, "../src/public/img/test.jpg");

    // Adjunta el archivo de imagen a la solicitud
    const response = await requester
      .post("/api/products")
      .field("title", productMock.title)
      .field("description", productMock.description)
      .field("price", productMock.price)
      .field("stock", productMock.stock)
      .field("category", productMock.category)
      .field("owner", productMock.owner)
      .attach("img", fs.readFileSync(imagePath), "testing.jpg");

    expect(response.status).to.eql(201);
    expect(response.body.result).to.eql("Producto creado con exito");
    expect(response.body.producto).to.be.an("object");
    expect(response.body.producto).to.have.property("_id");

    productId = response.body.producto._id;
  });

  const imagePath = path.join(__dirname, "../src/public/img/test.jpg");

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

    expect(response.status).to.eql(202);
    expect(response.body.result).to.eql("Producto obtenido con exito");
    expect(response.body.producto).to.be.an("object");
    expect(response.body.producto).to.have.property("_id", productId);
  });

  // Test 04: Actualizar un producto
  it("Actualizar un producto: el API PUT /api/products/:id debe actualizar un producto existente", async () => {
    const updatedProduct = {
      title: "testingUpdated",
      description: "testingUpdated",
      price: 10,
      stock: 30,
      category: "Updated",
    };

    const response = await requester
      .put(`/api/products/${productId}`)
      .send(updatedProduct);

    expect(response.status).to.eql(202);
    expect(response.body.result).to.eql("Producto modificado con exito");
    expect(response.body.payload).to.be.an("object");
  });

  // Test 05: Eliminar un producto
  it("Eliminar un producto: el API DELETE /api/products/:id debe eliminar un producto existente", async () => {
    const response = await requester.delete(`/api/products/${productId}`);

    expect(response.status).to.eql(202);
    expect(response.body.result).to.eql("Producto eliminado con exito");
    expect(response.body.payload).to.be.an("object");
    expect(response.body.payload).to.have.property("_id", productId);
  });
});

// /*======================
// =       SECTION 02     =
// =======================*/
// describe("Testing Login and session with cookies", () => {
//   // before
//   before(function () {
//     this.cookie;
//     this.testUser = {
//       first_name: "usuario de prueba",
//       last_name: "usuario de prueba",
//       email: "usuariodeprueba@usuariodeprueba.com",
//       age: 0,
//       password: 1234,
//     };
//   });
//   // test 01: Registro usuario
//   it(" Test registro de usuario: debe poder registrar un usuario", async function () {
//     //given
//     console.log(this.testUser);
//     //then
//     const { statusCode, _body } = await requester
//       .post("/api/sessions/register")
//       .send(this.testUser);
//     // assert
//     expect(statusCode).is.eqls(201);
//   });

//   //Test 02: Login user

//   //test 03: ruta protegida
// });
