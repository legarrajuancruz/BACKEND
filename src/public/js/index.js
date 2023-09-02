//DESDE CLIENTE AL SERVER
const socket = io();

// CREAR DESDE HTML Y ENVIAR A SERVER
document.getElementById("miFormulario").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    img: "Sin imagen",
  };
  socket.emit("mensajeKey", formData);
});

//ELIMINAR POR ID DESDE HTML Y ENVIAR A SERVER
document
  .getElementById("miFormularioDos")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const _id = document.getElementById("id").value;

    console.log(id);
    socket.emit("mensajeID", _id);
  });

//ELIMINAR DESDE BOTON DESDE CLIENTE HTML Y ENVIAR A SERVER
function enviarId(_id) {
  console.log("Producto a eliminar", _id);
  socket.emit("mensajeID", _id);
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
