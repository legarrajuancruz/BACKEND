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

/*==========================
-          CHATS            -
===========================*/

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

/*==========================
-        REGISTER           -
===========================*/

const registerUser = async () => {
  let first_name = document.getElementById("first_name").value;
  let last_name = document.getElementById("last_name").value;
  let email = document.getElementById("email").value;
  let age = document.getElementById("edad").value;
  let password = document.getElementById("password").value;

  const user = { first_name, last_name, email, age, password };

  const response = await fetch("/api/sessions/register", {
    method: "POST",
    headers: { "Content-type": "aplication/json; charset=UTF-8" },
    body: JSON.stringify(),
  });
  const data = await response.json();
};

document.getElementById("btnRegister").onclick = registerUser;
