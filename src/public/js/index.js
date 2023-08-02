//DESDE CLIENTE AL SERVER
const socket = io();

document.getElementById("miFormulario").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    Title: document.getElementById("title").value,
    Description: document.getElementById("description").value,
    Price: document.getElementById("price").value,
    img: "Sin imagen",
  };
  socket.emit("mensajeKey", formData);
});

socket.on("msgServer", (data) => {
  console.log(data);
});

socket.on("mensajeKey", (data) => {
  console.log("Mensaje Broadcast");
});

socket.on("eventoTodos", (data) => {
  console.log(data);
});
