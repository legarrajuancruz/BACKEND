function eliminarUsuario(id) {
  console.log(id);
  fetch(`/ruta/del/usuario/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error de red: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Usuario eliminado con éxito", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
