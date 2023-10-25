import express from "express";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

import config from "./config/config.js";

import MongoStore from "connect-mongo";
import singleton from "./config/singleton.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";

import __dirname from "./utils.js";
import { Server } from "socket.io";

import passport from "passport";
import initializedPassport from "./config/passport.config.js";

import ProductRouter from "./routes/product.router.js";
import CartRouter from "./routes/cart.router.js";
import UserRouter from "./routes/users.router.js";
import ticketRouter from "./routes/ticket.router.js";
import emailRouter from "./routes/email.router.js";

import sessionsRouter from "./routes/sessions.router.js";
import usersViewRouter from "./routes/users.views.router.js";
import viewRouter from "./routes/view.router.js";
import githubLoginViewRouter from "./routes/github-login.views.router.js";
import jwtRouter from "./routes/jwt.router.js";

import MessagesManager from "./services/dao/mongoManager/messageManagerMongo.js";
import ProductManager from "./services/dao/mongoManager/productManagerMongo.js";

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
const PORT = config.port;
const MONGO_url = config.mongoUrl;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//CONECTAR A BASE DE DATOS CON PATRON SINGLETON
const ConnectMongoDB = async () => {
  try {
    await singleton.getInstance();
  } catch (error) {
    console.log(error);
  }
};
ConnectMongoDB();

const httpserver = app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});

/*===============
|    SESSIONS   |
===============*/
app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10 * 60,
    }),
    secret: "s3cr3t",
    resave: false,
    saveUninitialized: false,
  })
);

/*===================
|      PASSPORT     |
===================*/
initializedPassport();
app.use(passport.initialize());
app.use(passport.session());

/*=================
|      ROUTES     |
=================*/
app.use(`/api/products`, ProductRouter);
app.use(`/api/carts`, CartRouter);
app.use("/api/users", UserRouter);
app.use(`/api/sessions`, sessionsRouter);
app.use("/api/ticket", ticketRouter);
app.use("/users", usersViewRouter);
app.use("/", viewRouter);
app.use("/github", githubLoginViewRouter);
app.use("/api/jwt", jwtRouter);
app.use("/api/email", emailRouter);

/*================================
|   SOCKET SERVER CONECCTION      |
=================================*/

const socketServer = new Server(httpserver);

//SE ABRE CANAL
socketServer.on("connection", (socket) => {
  /*  |        REAL TIME PRODUCTS       | */

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

  /*  |        CHAT       | */

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
