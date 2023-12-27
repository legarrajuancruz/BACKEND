/*==========================
-    CREAR NUEVO PRODUCTO   -
===========================*/
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

/*==============================================
|  BORRAR DESDE INPUT ID --> ELIMINAR PRODUCTO  |
===============================================*/
const borrarProductoID = async () => {
  try {
    let id = document.getElementById("id").value;
    console.log(id);

    const producto = { _id: id, uid: userId };
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(producto),
    });

    if (response.status === 202 || response.status === 203) {
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
      throw new Error("Hubo un problema al eliminar el producto");
    }
  } catch (error) {
    console.error(error);
    alert("Hubo un problema al eliminar el producto");
  }
};
document.getElementById("btn-ID").onclick = borrarProductoID;

/*========================================================
| BORRAR DESDE BOTON EN EL PRODUCTO --> ELIMINAR PRODUCTO |
=========================================================*/

const deleteProductButton = async (id) => {
  try {
    console.log(id);

    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ _id: id, uid: userId }),
    });

    if (response.status === 202) {
      alert("Producto eliminado con exito");
      location.href = "/realtimeproducts";
    } else if (response.status === 203) {
      alert("Producto eliminado por ADMIN con éxito");
      location.href = "/realtimeproducts";
    } else {
      throw new Error("Hubo un problema al eliminar el producto");
    }
  } catch (error) {
    console.error(error);
    alert("Hubo un problema al eliminar el producto");
  }
};
