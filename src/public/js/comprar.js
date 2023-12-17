const comprarItems = async () => {
  let _id = document.getElementById("cartID").value;
  console.log(_id);

  const response = await fetch(`/api/ticket/${_id}`, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ _id }),
  })
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
  // location.href = "/products";
};

document.getElementById("btnTerminarCompra").onclick = comprarItems;
