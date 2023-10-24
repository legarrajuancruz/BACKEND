function agregar(button) {
  const uid = document.getElementById("userID").textContent;
  const pid = button.getAttribute("data-id");

  fetch(`api/users/${uid}/products/${pid}`, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
