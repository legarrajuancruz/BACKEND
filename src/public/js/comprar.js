function agregar(button) {
  const uid = document.getElementById("user").textContent;
  console.log(uid);

  fetch(`api/ticket/${uid}`, {
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
