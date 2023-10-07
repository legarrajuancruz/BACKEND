import mongoose from "mongoose";
import config from "./config.js";

export default class singleton {
  static #instance;

  constructor() {
    this.#connectMongoDB();
  }

  static getInstance() {
    if (this.#instance) {
      console.log("Ya existe una coneccion a el servidor");
    } else {
      this.#instance = new singleton();
      console.log("Coneccion establecida con servidor");
    }
    return this.#instance;
  }

  #connectMongoDB = async () => {
    try {
      await mongoose.connect(config.mongoUrl);
    } catch (error) {
      console.error("No se pudo conectar con la base de datos");
      process.exit();
    }
  };
}
