const comprarItems = async () => {
  let uid = document.getElementById("userID").value;
  let cid = document.getElementById("cartID").value;

  const response = await fetch(`/api/ticket/${uid}`, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ uid, cid }),
  })
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
  location.href = "/products";
};

document.getElementById("btnTerminarCompra").onclick = comprarItems;

////////////////////////////////

function eliminar(button) {
  const cid = document.getElementById("cartID").value;
  const pid = button.getAttribute("data-id");

  fetch(`/api/carts/${cid}/products/${pid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error de red: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Producto eliminado con éxito", data);
      window.location.href = "/carts";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
