import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;

const requester = supertest("http//localhost:8080");

//contexto global
describe("Testing Supermarket app", () => {
  before();

  /*================================
    =           SECTION 01           =
    =================================*/
  //contexto local
  describe("Testing products Api", () => {
    // Test 01
    it("Crear producto: el API POST /api/products debe crear un nuevo producto", async () => {
      // Given
      const productMock = {
        title: "Fernet",
        description: "Branca clasico",
        price: 7500,
        stock: 25,
        category: "Bebidas",
        img: "/img/fernetBranca.jpg",
      };
      // Then
      const { statusCode, ok, _body } = await requester
        .post("api/products")
        .send(productMock);
      console.log(result);

      // Assert
      expect(statusCode).is.eqls(201);
      expect(_body.payload).is.ok.and.to.have.property("_id");
      expect(_body.payload).to.have.property("owner");
    });

    // Test 02
    it("Crear  un producto sin title o el precio no es numerico: precio: EL API POST /api/products debe retornar un codigo de estado HTTP 400", async () => {
      // Given
      const productMock = {
        title: "Fernet",
        description: "Branca clasico",
        stock: 25,
        category: "Bebidas",
        img: "/img/fernetBranca.jpg",
      };

      //Then
      const { statusCode, _body } = await requester
        .post("api/products")
        .send(productMock);
      console.log(result);

      // Assert
      expect(statusCode).is.eqls(400);
    });
  });

  /*================================
    =           SECTION 02           =
    =================================*/
  //contexto local
  describe("Testing carts Api");

  /*================================
    =           SECTION 03           =
    =================================*/
  //contexto local
  describe("Testing Login y Sessions con cokies");
});
