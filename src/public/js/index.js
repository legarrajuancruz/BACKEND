//DESDE CLIENTE AL SERVER
const socket = io();

// CREAR DESDE HTML Y ENVIAR A SERVER
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

//ELIMINAR POR ID DESDE HTML Y ENVIAR A SERVER
document
  .getElementById("miFormularioDos")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const id = document.getElementById("id").value;

    console.log(id);
    socket.emit("mensajeID", id);
  });

//ELIMINAR DESDE BOTON DESDE CLIENTE HTML Y ENVIAR A SERVER
function enviarId(id) {
  console.log("Producto a eliminar", id);
  socket.emit("mensajeID", id);
}

//RECIBE NOTIFICACIONES DESDE SERVER
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
