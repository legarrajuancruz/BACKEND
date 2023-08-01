//DESDE CLIENTE AL SERVER
const socket = io();

socket.emit("mensajeKey", "Hola desde el cliente");

socket.on("msgServer", (data) => {
  console.log(data);
});

socket.on("mensajeKey", (data) => {
  console.log("Mensaje Broadcast");
});

socket.on("eventoTodos", (data) => {
  console.log(data);
});
