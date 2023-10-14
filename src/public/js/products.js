function agregar(button) {
  const id = button.getAttribute("data-id");

  console.log(id);
  //Deje el carrito 1 predeterminado
  fetch(`api/carts/64ebbe696b25063b124086ab/products/${id}`, {
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
