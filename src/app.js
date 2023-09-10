import express from "express";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
//import FileStore from "session-file-store";

import __dirname from "./utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";

import ProductRouter from "./routes/product.routes.js";
import CartRouter from "./routes/cart.routes.js";
import SessionsRouter from "./routes/sessions.router.js";
import usersViewRouter from "./routes/users.views.router.js";
import viewRouter from "./routes/view.router.js";

import MessagesManager from "./dao/mongoManager/messageManagerMongo.js";
import ProductManager from "./dao/mongoManager/productManagerMongo.js";

const app = express();

/*=================
|    HANDLEBARS   |
=================*/
app.set("views", __dirname + "/views");
app.engine(
  "handlebars",
  expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

/*================
|      SERVER    |
================*/
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpserver = app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});

//const fileStorage = FileStore(session);

const MONGO_url =
  "mongodb+srv://legarrajuan:21dBt5XzVUd2DOlQ@cluster0.ftgsun9.mongodb.net/ecommerse?retryWrites=true&w=majority";

/*===============
|    SESSIONS   |
===============*/
app.use(cookieParser());

app.use(
  session({
    // store: new fileStorage({ path: "./sessions", ttl: 15, retries: 0 }),
    store: MongoStore.create({
      mongoUrl: MONGO_url,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10,
    }),
    secret: "s3cr3t",
    resave: false,
    saveUninitialized: false,
  })
);

/*=================
|      ROUTES     |
=================*/
app.use(`/api/products`, ProductRouter);
app.use(`/api/carts`, CartRouter);
app.use(`/api/sessions`, SessionsRouter);
app.use("/users", usersViewRouter);
app.use("/", viewRouter);

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

  //ELIMINAR DESDE BOTON
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

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_url);
    console.log("Conectado con exito a MongoDB usando mongoose");
  } catch (error) {
    console.error("No se pude conectar con la base de datos" + error);
    process.exit();
  }
};

connectMongoDB();
