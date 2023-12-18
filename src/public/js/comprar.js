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
