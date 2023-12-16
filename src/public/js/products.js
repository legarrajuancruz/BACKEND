function agregar(button) {
  const cid = document.getElementById("userID").textContent;
  const pid = button.getAttribute("data-id");

  const queryParams = `?cid=${cid}&pid=${pid}`;
  const requestBody = { quantity: 1 };

  fetch(`/api/carts/${cid}/products/${pid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error de red: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Producto enviado con exito", data);
      alert("Producto agregado al carrito");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
