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
    // Simular la creación de un nuevo producto para ser eliminado
    const productMock = {
      title: "Producto a Eliminar",
      description: "Descripción del producto a eliminar",
      price: 100,
      stock: 10,
      category: "Test",
      owner: "653aeeec4905f64e60f50b20", // Ajusta esto con un ID(admin) de usuario válido
    };

    const createResponse = await requester
      .post("/api/products")
      .field("title", productMock.title)
      .field("description", productMock.description)
      .field("price", productMock.price)
      .field("stock", productMock.stock)
      .field("category", productMock.category)
      .field("owner", productMock.owner)
      .attach("img", fs.readFileSync(imagePath), "testing.jpg");

    expect(createResponse.status).to.eql(201);
    expect(createResponse.body.result).to.eql("Producto creado con exito");
    expect(createResponse.body.producto).to.be.an("object");
    expect(createResponse.body.producto).to.have.property("_id");

    const productId = createResponse.body.producto._id;

    // Simular la eliminación del producto recién creado
    const deleteResponse = await requester
      .delete(`/api/products/${productId}`)
      .send({ _id: productId, uid: "653aeeec4905f64e60f50b20" }); // Ajusta el ID de usuario según tus necesidades

    expect(deleteResponse.status).to.eql(203);
    expect(deleteResponse.body.result).to.eql(
      "Producto eliminado por ADMIN con exito"
    );
    expect(deleteResponse.body.payload).to.be.an("object");
    expect(deleteResponse.body.payload).to.have.property("_id", productId);
  });
});

// /*======================
// =       SECTION 02     =
// =======================*/

describe("Sessions API", () => {
  // Prueba de inicio de sesión exitoso
  it("Inicio de sesión exitoso y devuelve token", async () => {
    const response = await requester.post("/api/sessions/login").send({
      email: "adminCoder@coder.com",
      password: "adminCod3r123",
    });

    expect(response.status).to.equal(201); // Ajusta según tu lógica
    expect(response.body).to.have.property("access_token");
  });

  // Prueba de inicio de sesión fallido (credenciales incorrectas)
  it("Inicio de sesión fallido para credenciales incorrectas y devuelve 401", async () => {
    const response = await requester.post("/api/sessions/login").send({
      email: "correo@incorrecto.com",
      password: "contraseñaincorrecta",
    });
    expect(response.status).to.equal(401);
  });

  // Prueba de registro exitoso
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

  // Prueba de registro fallido (usuario ya existente)
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
    expect(response.body).to.have.property("message", "Usuario ya registrado");
  });
});
