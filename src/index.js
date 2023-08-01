import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/cart.routes.js";
import viewRouter from "./router/view.router.js";
import { Server } from "socket.io";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/api/products`, ProductRouter);
app.use(`/api/carts`, CartRouter);

app.use(express.static(__dirname + `/public/img`));

const httpserver = app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});

app.use("/", viewRouter);

//SOCKET SERVER CONECCTION
const socketServer = new Server(httpserver);

//SE ABRE CANAL
socketServer.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado`);

  socket.on("mensajeKey", (data) => {
    console.log(data);
  });
  socket.emit("msgServer", "Mensaje desde server");

  socket.broadcast.emit("mensajeKey", "Mensaje desde server para todos");

  socketServer.emit("eventoTodos", "Imprime para todos");
});

app.listen(PORT, () => {
  console.log(`Server port on ${PORT}`);
  console.log(__dirname);
});
