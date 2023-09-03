import express from "express";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

import __dirname from "./utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";

import ProductRouter from "./routes/product.routes.js";
import CartRouter from "./routes/cart.routes.js";
import viewRouter from "./routes/view.router.js";

import MessagesManager from "./dao/mongoManager/messageManagerMongo.js";
import ProductManager from "./dao/mongoManager/productManagerMongo.js";

import session from "express-session";
import FileStore from "session-file-store";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//STATIC
app.use(express.static(__dirname + "/public"));
//app.use(express.static(__dirname + `/public/img`));

//HANDLEBARS
app.set("views", __dirname + "/views");
app.engine(
  "handlebars",
  expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");

//RUTAS
app.use(`/api/products`, ProductRouter);
app.use(`/api/carts`, CartRouter);
app.use("/", viewRouter);

//SERVER
const httpserver = app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});

//SOCKET SERVER CONECCTION
const socketServer = new Server(httpserver);

//SE ABRE CANAL
socketServer.on("connection", (socket) => {
  /*================================
  |        REAL TIME PRODUCTS       |
  =================================*/

  //CREAR PRODUCTO
  socket.on("mensajeKey", (data) => {
    const productos = new ProductManager();

    console.log("Se agrego producto");
    console.log(data);

    productos.crearProducto(data);
    socket.emit("msgServer", "Nuevo Producto agregado");
    socket.emit("msgServer", data);
  });

  //ELIMINAR POR ID
  socket.on("mensajeID", (data) => {
    const productos = new ProductManager();
    console.log("Se envio ID");
    console.log(data);
    let id = data;
    productos.borrarProducto(id);
    socket.emit("msgServer", "Producto eliminado de servidor");
  });

  socket.on("elimarProductoBoton", (data) => {
    const productos = new ProductManager();
    console.log("Se envio ID");
    console.log(data);
    let id = data;
    productos.borrarProducto(id);
    socket.emit("msgServer", "Producto eliminado de servidor");
  });

  socket.broadcast.emit(
    "mensajeKey",
    "Hay un nuevo producto en la base de datos"
  );

  /*===================
  |        CHAT       |
  ===================*/

  //CONVERSACION EN ARRAY
  const messagesManager = new MessagesManager();
  const mensajes = [];

  //RECIBE
  socket.on("message", async (data) => {
    mensajes.push(data);
    console.log(data);
    await messagesManager.createMessage(data);
    //EMITE
    socketServer.emit("conversacion", mensajes);

    console.log(mensajes);
  });
  socket.on("userConnected", (data) => {
    console.log(data);
    socket.broadcast.emit("userConnected", data);
  });
  socket.on("closeChat", (data) => {
    if (data.close == "close") {
      socket.disconnect();
    }
  });
});

/*===============
|    SESSIONS   |
===============*/
const FileStoreage = FileStore(session);

app.use(
  seession({
    store: new FileStoreage({ path: "./sessions", ttl: 15, retries: 0 }),
  })
);

const DB =
  "mongodb+srv://legarrajuan:21dBt5XzVUd2DOlQ@cluster0.ftgsun9.mongodb.net/ecommerse?retryWrites=true&w=majority";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Conectado con exito a MongoDB usando mongoose");
  } catch (error) {
    console.error("No se pude conectar con la base de datos" + error);
    process.exit();
  }
};

connectMongoDB();
