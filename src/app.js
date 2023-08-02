import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/cart.routes.js";
import viewRouter from "./router/view.router.js";
import { Server } from "socket.io";
import ProductManager from "./controllers/ProductManager.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/api/products`, ProductRouter);
app.use(`/api/carts`, CartRouter);
app.use("/", viewRouter);

//HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//STATIC
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + `/public/img`));

//SERVER
const httpserver = app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});

//SOCKET SERVER CONECCTION
const socketServer = new Server(httpserver);

//SE ABRE CANAL
socketServer.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado`);

  socket.on("mensajeKey", (data) => {
    const productos = new ProductManager();

    console.log("Se agrego producto");
    console.log(data);

    productos.addProducts(data);
    socket.emit("msgServer", "Nuevo Producto agregado");
    socket.emit("msgServer", data);
  });

  socket.broadcast.emit("mensajeKey", "Mensaje desde server para todos");
});
