function agregar(button) {
  const uid = document.getElementById("userID").textContent;
  const pid = button.getAttribute("data-id");

  //Deje el carrito 1 predeterminado
  fetch(`api/users/${uid}/products/${pid}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
