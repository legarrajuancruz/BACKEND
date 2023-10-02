//DESDE CLIENTE AL SERVER

const socket = io();

/*==========================
-    REAL TIME PRODUCTS    -
===========================*/

// CREAR DESDE HTML Y ENVIAR A SERVER
document.getElementById("miFormulario").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    img: document.getElementById("img").value,
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
function enviarId(id) {
  alert("Producto ELiminado");

  console.log("Producto a eliminar", id);
  socket.emit("elimarProductoBoton", id);
}
