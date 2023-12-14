function agregar(button) {
  const uid = document.getElementById("userID").textContent;
  const pid = button.getAttribute("data-id");

  console.log(uid);
  console.log(pid);

  const agregar = { uid, pid };
  console.log(agregar);

  fetch(`/api/users/${uid}/products/${pid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agregar),
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
