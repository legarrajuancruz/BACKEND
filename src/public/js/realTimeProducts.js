/*==========================
-    REAL TIME PRODUCTS    -
===========================*/
const createProduct = async () => {
  document
    .getElementById("miFormulario")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        img: document.getElementById("img").value,
        owner: document.getElementById("owner").textContent,
      };

      try {
        const response = await fetch("/api/products/", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify(formData),
        });

        if (response.status === 201) {
          alert("Nuevo producto creado con éxito");
        } else {
          alert("Hubo un problema al crear el producto");
        }
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Hubo un error al procesar la solicitud");
      }
    });
};

createProduct();

// document.getElementById("btnCreate").onclick = createProduct;

//   socket.emit("mensajeKey", formData);
// });

// //ELIMINAR POR ID DESDE HTML Y ENVIAR A SERVER
// document
//   .getElementById("miFormularioDos")
//   .addEventListener("submit", (event) => {
//     event.preventDefault();

//     const _id = document.getElementById("id").value;

//     console.log(id);
//     socket.emit("mensajeID", _id);
//   });

// //ELIMINAR DESDE BOTON DESDE CLIENTE HTML Y ENVIAR A SERVER
// function enviarId(id) {
//   alert("Producto ELiminado");

//   console.log("Producto a eliminar", id);
//   socket.emit("elimarProductoBoton", id);
// }
