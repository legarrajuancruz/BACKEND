import path from "path";
import {
  cartService,
  productService,
  userService,
} from "../services/factory.js";

/*===============
  -  GET USERS  -
  ==============*/
const ControlgetUsers = async (req, res) => {
  try {
    let users = await userService.getUsers();

    res.status(202).send({
      result: "Usuarios obtenidos con exito",
      Usuarios: users,
    });
  } catch (error) {
    console.error("No se pudo obtener usuarios con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo obtener usuarios con mongoose",
      message: error,
    });
  }
};

/*=====================
  -  GET USERS by ID  -
  ===================*/
const ControlgetUsersById = async (req, res) => {
  try {
    const _id = req.params.id;
    let user = await userService.getUserByID(_id);

    res.status(202).send({
      result: "Usuario obtenido con exito",
      Usuario: user,
    });
  } catch (error) {
    console.error("No se pudo obtener el usuario con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo obtener el usuario con mongoose",
      message: error,
    });
  }
};

/*=================
  -  UPDATE USER  -
  ===============*/
const updateUser = async (filter, value) => {
  let result = await userService.updateOne(filter, value);
  return result;
};

/*===========================
  -   DELETE USER By ID  -
  ==========================*/
const ControlDeleteUserID = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    let result = await userService.deleteUser(id);
    res.status(200).send({
      result: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.error("No se pudo eliminar el usuario con mongoose" + error);
    res.status(500).send({
      error: "No se pudo eliminar el usuario, usuario no encontrado",
      message: error,
    });
  }
};

/*=====================
  -  CHANGE USER ROL  -
  ===================*/
const ControlchangeRol = async (req, res) => {
  try {
    const { id } = req.params;
    const itsAdmin = await userService.getUserByID(id);
    console.log("Rol de Usuario");
    console.log(itsAdmin.role);
    if (itsAdmin.role === "admin") {
      res.status(400).send({
        result: "Rol no fue actualizado",
      });
      return;
    }
    const { newRole } = req.body;
    const result = await userService.changeRol(id, newRole);

    res.status(201).send({
      result: "Rol actualizado exitosamente",
    });
  } catch (error) {
    console.error("No se pudo actualizar el rol del usuario", error);
    res.status(500).send({
      error: "No se pudo actualizar el rol del usuario",
      message: error.message,
    });
  }
};

/*===========================
  -   SEND EMAIL RESET PASS  -
  ==========================*/
const ControlresetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("ESTA ACA - RESET CONTROLLER");
    console.log({ email });

    const enviado = await userService.emailResetPassword({ email });
    console.log(enviado);
    res.status(201).send({ message: "email enviado con éxito" });
  } catch (error) {
    console.error("No se pudo enviar el email con mongoose:", error);
    res.status(500).send({
      error: "No se pudo enviar el correo, usuario no encontrado",
      message: error,
    });
  }
};

/*==========================
  -      NEW PASSWORD      -
  ========================*/
const ControlnuevaPassword = async (req, res) => {
  try {
    let { nueva, confirmar, token } = req.body;
    console.log(req.body);

    let modificado = await userService.updatePassword(req.body);

    if (modificado.error) {
      return res.status(403).send({
        result: " Usuario no pudo ser modificado",
        user: modificado.password,
      });
    }

    res.status(201).send({
      result: " Usuario modificado con exito",
      user: modificado.password,
    });
  } catch (error) {
    console.error("No se pudo actualizar la contraseña con mongoose:" + error);
    res.status(500).send({
      error:
        "Error en la contraseña, contrata a un verdadero equipo de programadores",
      message: error,
    });
  }
};

/*=========================
  - SEND FILES PROFILE    -
  =======================*/
const handleProfileUpload = async (req, res) => {
  try {
    const { uid } = req.body;
    let user = await userService.getUserByID(uid);
    console.log(user);

    const profileImage = req.files["profiles"][0];
    const documentFile = req.files["document"][0];

    console.log("Perfil:", profileImage);
    console.log("Documento:", documentFile);

    // Crear array documents
    if (!user.documents) {
      user.documents = [];
    }

    // Actualiza el estado de los documentos en el modelo del usuario
    user.documents.push({
      name: profileImage.originalname,
      reference: path.join(`/uploads/profiles/${profileImage.filename}`),
      status: "Uploaded",
    });

    user.documents.push({
      name: documentFile.originalname,
      reference: path.join(`/uploads/documents/${documentFile.filename}`),
      status: "Uploaded",
    });

    await user.save();

    const script = `
      <script>
        alert('Archivos enviados correctamente');
        window.location.href = '/users/'; 
      </script>
    `;

    res.send(script);
  } catch (error) {
    console.error("Error al procesar la subida de archivos", error);
    res.status(500).send("Error interno del servidor");
  }
};

/*=============================
    -  SEND ADDRESS DOCUMENT   -
    ==========================*/
const handlePremium = async (req, res) => {
  try {
    const { uid } = req.body;
    const user = await userService.getUserByID(uid);
    console.log(user);

    const identificationDocument = req.files["identificationDocument"][0];
    const domicileDocument = req.files["domicileDocument"][0];
    const accountStatementDocument = req.files["accountStatementDocument"][0];

    console.log("Identificación:", identificationDocument);
    console.log("Comprobante de domicilio:", domicileDocument);
    console.log("Comprobante de estado de cuenta:", accountStatementDocument);

    if (!user.documents) {
      user.documents = [];
    }

    user.documents.push({
      name: identificationDocument.originalname,
      reference: path.join(
        `/uploads/identificationDocuments/${identificationDocument.filename}`
      ),
      status: "Uploaded",
    });

    user.documents.push({
      name: domicileDocument.originalname,
      reference: path.join(
        `/uploads/domicileDocument/${domicileDocument.filename}`
      ),
      status: "Uploaded",
    });

    user.documents.push({
      name: accountStatementDocument.originalname,
      reference: path.join(
        `/uploads/accountStatementDocuments/${accountStatementDocument.filename}`
      ),
      status: "Uploaded",
    });

    user.role = "premium";
    await user.save();

    const script = `
    <script>
      alert('Ahora ere user PREMIUM');
      window.location.href = '/users/login'; 
    </script>
  `;

    res.send(script);
  } catch (error) {
    console.error("Error al procesar la subida de documentos", error);
    res.status(500).send("Error interno del servidor");
  }
};
/*========================================
    - BORRAR USUARIOS INACTIVOS 30 MIN     -
    =======================================*/
const deleteInactive = async (req, res) => {
  try {
    const inactiveUsers = await userService.findInactiveUsers();
    console.log(inactiveUsers);
    const result = [];
    if (inactiveUsers.length > 0) {
      //ACTIVAR PARA BORRAR LOS USUARIOS
      // await userService.deleteInactiveUsers(inactiveUsers);
      await userService.sendNotificationEmails(inactiveUsers);
    }

    res.status(200).send({
      result: "Usuarios inactivos eliminados y notificados correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar usuarios inactivos:", error);
    res.status(500).send({
      error: "Error al eliminar usuarios inactivos",
      message: error.message,
    });
  }
};

/*===================================
    - VISTA DE USUARIOS DE ADMIN     -
    ================================*/
const ControlViewUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserByID(id);
    res.render("viewUser", { user });
  } catch (error) {
    console.error(
      "Error al obtener información del usuario con mongoose" + error
    );
    res.status(500).send({
      error: "No se pudo obtener información del usuario",
      message: error,
    });
  }
};

export default {
  ControlgetUsers,
  ControlgetUsersById,
  ControlchangeRol,
  ControlDeleteUserID,
  updateUser,
  ControlresetPassword,
  ControlnuevaPassword,
  handleProfileUpload,
  handlePremium,
  deleteInactive,
  ControlViewUserById,
};
