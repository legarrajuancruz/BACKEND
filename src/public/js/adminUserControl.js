function eliminarUsuario(id) {
  console.log(id);
  fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error de red: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      alert("Usuario eliminado con éxito", data);
      location.href = "/admin";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
