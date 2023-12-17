function agregar(uid) {
  console.log(uid);

  fetch(`/api/ticket/${uid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
  // location.href = "/products";
}
