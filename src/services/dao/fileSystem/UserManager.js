import { promises as fs } from "fs";

class UserManager {
  constructor() {
    this.path = "./src/dao/filemanager/dbjson/users.json";
  }

  /*==========
- READ JSON  -
============*/
  readUsers = async () => {
    let products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  /*============
-  WRITE JSON  -
==============*/
  writeUsers = async (user) => {
    await fs.writeFile(this.path, JSON.stringify(user));
  };

  /*=============
-    ADD User  -
===============*/
  crearUsuario = async (product) => {
    let productsOld = await this.readUsers();
    product.id = productsOld.length;

    let productAll = [...productsOld, product];
    await this.writeUsers(productAll);

    return "Producto agregado";
  };

  /*=============
- GET Products  -
===============*/
  leerUsuarios = async () => {
    return await this.readUsers();
  };

  /*================
- GET Products ID -
==================*/
  getUserbyId = async (id) => {
    let busquedaById = await this.existe(id);
    if (!busquedaById) {
      return "Producto no encontrado";
    } else {
      return busquedaById;
    }
  };

  /*================
- EXISTE Producto ? -
==================*/
  existe = async (id) => {
    let users = await this.readUsers();
    return users.find((eL) => eL.id === id);
  };

  /*================
-     DELETE Id     -
==================*/
  borrarUsuario = async (id) => {
    let users = await this.readUsers();
    let busquedaId = users.some((eL) => eL.id === id);

    if (busquedaId) {
      let filtrados = users.filter((eL) => eL.id != id);
      await this.writeUsers(filtrados);
      return `Usuario eliminado`;
    }
    return "Usuario no existe";
  };

  /*================
-     UPDATE Id     -
==================*/
  actualizarUsuario = async (id, nuevo) => {
    let parseado = await this.readUsers();
    let usuarioExiste = await this.existe(id);

    if (!usuarioExiste) {
      return "Usuario no existe";
    } else {
      let busquedaFiltrada = parseado.filter((eL) => eL.id != id);

      let modificado = [{ ...nuevo, id: id }, ...busquedaFiltrada];

      await fs.writeFile(this.path, JSON.stringify(modificado, null, 2, `\t`));

      return `Usuario actualizado`;
    }
  };
}

export default UserManager;
