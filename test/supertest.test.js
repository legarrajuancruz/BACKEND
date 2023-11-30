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
      const result = requester.post("api/products").send(productMock);
      console.log(result);

      // Assert
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
