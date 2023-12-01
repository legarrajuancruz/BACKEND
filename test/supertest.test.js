import chai from "chai";
import supertest from "supertest";

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
      title: "Fernet",
      description: "Branca clasico",
      price: 7500,
      stock: 25,
      category: "Bebidas",
      img: "/img/fernetBranca.jpg",
      owner: "653990f848e406023a7d97cf", // Ajusta esto con un ID de usuario válido
    };

    const response = await requester.post("/api/products").send(productMock);

    expect(response.status).to.eql(201);
    expect(response.body.result).to.eql("Producto creado con exito");
    expect(response.body.producto).to.be.an("object");
    expect(response.body.producto).to.have.property("_id");

    productId = response.body.producto._id;
  });

  // Test 02: Crear un producto con datos incompletos
  it("Crear un producto sin title o el precio no es numerico: precio: EL API POST /api/products debe retornar un codigo de estado HTTP 400", async () => {
    const productMock = {
      description: "Branca clasico",
      stock: 25,
      category: "Bebidas",
      img: "/img/fernetBranca.jpg",
      owner: "653990f848e406023a7d97cf", // Ajusta esto con un ID de usuario válido
    };

    const response = await requester.post("/api/products").send(productMock);

    expect(response.status).to.eql(400);
    expect(response.body.error).to.eql("Incompleto");
    expect(response.body.result).to.eql("Producto no pudo ser creado");
    expect(response.body.producto).to.be.an("object");
  });

  // Test 03: Obtener producto por ID
  it("Obtener producto por ID: el API GET /api/products/:id debe retornar un producto existente", async () => {
    const response = await requester.get(`/api/products/${productId}`);

    expect(response.status).to.eql(202);
    expect(response.body.result).to.eql("Producto obtenido con exito");
    expect(response.body.producto).to.be.an("object");
    expect(response.body.producto._id).to.eql(productId);
  });

  // Test 04: Obtener todos los productos
  it("Obtener todos los productos: el API GET /api/products debe retornar una lista de productos", async () => {
    const response = await requester.get("/api/products");

    expect(response.status).to.eql(200);
    expect(response.body.result).to.eql("Productos obtenidos con exito");
    expect(response.body.Productos).to.be.an("array");
  });

  // Test 05: Modificar producto
  it("Modificar producto: el API PUT /api/products/:id debe modificar un producto existente", async () => {
    const updatedProduct = {
      title: "Fernet Modificado",
      description: "Branca clasico modificado",
      price: 8000,
      stock: 30,
      category: "Bebidas modificadas",
      img: "/img/fernetBranca_modificado.jpg",
    };

    const response = await requester
      .put(`/api/products/${productId}`)
      .send(updatedProduct);

    expect(response.status).to.eql(202);
    expect(response.body.result).to.eql("Producto modificado con exito");
    expect(response.body.payload).to.be.an("object");
    expect(response.body.payload._id).to.eql(productId);
  });

  // Test 06: Eliminar producto
  it("Eliminar producto: el API DELETE /api/products/:id debe eliminar un producto existente", async () => {
    const response = await requester.delete(`/api/products/${productId}`);

    expect(response.status).to.eql(202);
    expect(response.body.result).to.eql("Producto eliminado con exito");
    expect(response.body.payload).to.be.an("object");
    expect(response.body.payload._id).to.eql(productId);
  });
});

/*======================
=       SECTION 02     =
=======================*/
describe("Testing Login and session with cookies", () => {});
