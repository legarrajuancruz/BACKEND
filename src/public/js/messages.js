const socket = io();
let user = "";
const chatbox = document.getElementById("chatBox");

/*====================
APLICANDO SWEET ALERT 
====================*/

Swal.fire({
  icon: "info",
  title: "Hola Usuario",
  input: "text",
  text: "Ingrese nickname",
  inputValidator: (value) => {
    if (!value) {
      return "Necesitas ingresar un nick";
    }
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;

  socket.emit("userConnected", { user: user });

  /*====================
    NOMBRE USUARIO HTML 
   ====================*/
  const chatbox = document.getElementById("myName");
  myName.innerHTML = user;
});

/*====================
   CHAT USUARIOS 
====================*/
chatbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatbox.value });
      chatbox.value = "";
    }
  }
});

socket.on("conversacion", (data) => {
  const messageLogs = document.getElementById("chatlogs");
  let logs = "";

  data.forEach((eL) => {
    logs += `${eL.user} dice: ${eL.message} <br/"> `;
    messageLogs.innerHTML = logs;
  });
});

socket.on("userConnected", (data) => {
  let message = `${data.user}`;
  Swal.fire({
    icon: "info",
    title: `Nuevo usuario conectado: ${data.user}`,
    toast: true,
  });
});

const closeChatBox = document
  .getElementById("closeChatBox")
  .addEventListener("click", () => {
    socket.emit("closeChat", { close: "close" });
    chatlogs.innerHTML = "";
    myName.innerHTML = user + " - Desconectado";
  });
