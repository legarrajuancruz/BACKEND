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

////////////////////////////////////////////////

function guardarNuevoRol(id) {
  const form = document.getElementById(`form_${id}`);
  const select = document.getElementById(`roleSelect_${id}`);
  const selectedValue = select.value;

  const requestBody = {
    newRole: select.value,
  };

  fetch(`/api/users/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error de red: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      alert("Rol actualizado con éxito");
      location.href = "/admin";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
