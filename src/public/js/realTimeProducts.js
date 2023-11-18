/*==========================
-    REAL TIME PRODUCTS    -
===========================*/
//CREAR PRODUCTO
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
          location.href = "/realtimeproducts";
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

//ELIMINAR POR ID DESDE EL BOX
const borrarProductoID = async () => {
  let id = document.getElementById("id").value;

  const producto = { _id: id };
  await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(producto),
  }).then((result) => {
    if (result.status === 202) {
      alert("Producto eliminado con éxito");
      location.reload();
    } else {
      alert("Hubo un problema para eliminar el producto");
    }
  });
};

document.getElementById("btn-ID").onclick = borrarProductoID;

//BORRAR DESDE BOTON PRODUCTO
const deleteProductButton = async (id) => {
  console.log(id);

  await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ _id: id }),
  }).then((result) => {
    if (result.status === 202) {
      alert("Producto eliminado con éxito");
      location.reload();
    } else {
      alert("Hubo un problema para eliminar el producto");
    }
  });
};
