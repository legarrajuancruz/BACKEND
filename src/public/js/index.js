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

document
  .getElementById("miFormularioDos")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const id = document.getElementById("id").value;

    console.log(id);
    socket.emit("mensajeID", id);
  });

socket;
socket.on("msgServer", (data) => {
  console.log(data);
});

socket.on("mensajeKey", (data) => {
  console.log("Se agrego un nuevo producto");
});

socket.on("eventoTodos", (data) => {
  console.log(data);
});
