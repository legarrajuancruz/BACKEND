/*==========================
-    REAL TIME PRODUCTS    -
===========================*/
//CREAR PRODUCTO
const createProduct = async () => {
  document
    .getElementById("miFormulario")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData();
      formData.append("title", document.getElementById("title").value);
      formData.append(
        "description",
        document.getElementById("description").value
      );
      formData.append("price", document.getElementById("price").value);
      formData.append("stock", document.getElementById("stock").value);
      formData.append("category", document.getElementById("category").value);
      formData.append("img", document.getElementById("img").files[0]);
      formData.append("owner", document.getElementById("owner").textContent);

      try {
        const response = await fetch("/api/products/", {
          method: "POST",
          body: formData,
        });

        if (response.status === 201) {
          alert("Nuevo producto creado con éxito");
          location.href = href = "/realtimeproducts";
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

let userId = document.getElementById("owner").textContent;
// ELIMINAR POR ID DESDE EL BOX
const borrarProductoID = async () => {
  try {
    let id = document.getElementById("id").value;

    const producto = { _id: id, uid: userId };
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(producto),
    });

    console.log(response);

    if (response.status === 200) {
      const data = await response.json();

      console.log(data);

      if (data.result === "Producto eliminado con éxito") {
        alert("Producto eliminado con éxito");
        location.href = "/realtimeproducts";
      } else if (data.result === "Producto eliminado por ADMIN con éxito") {
        alert("Producto eliminado por ADMIN con éxito");
        location.href = "/realtimeproducts";
      }
    } else {
      alert("Hubo un problema al eliminar el producto");
    }
  } catch (error) {
    console.error(error);
    alert("Hubo un problema al eliminar el producto");
  }
};
//BORRAR DESDE BOTON PRODUCTO

const deleteProductButton = async (id) => {
  console.log(id);

  await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ _id: id, uid: userId }),
  }).then((result) => {
    if (result.status === 202) {
      alert("Producto eliminado con éxito");
      location.href = "/realtimeproducts";
    }
    if (result.status === 203) {
      alert("Producto eliminado por ADMIN con éxito");
      location.href = "/realtimeproducts";
    }
  });
};
