/*=======================
-     NEW PASSWORD      -
=======================*/

const actualizarPassword = async () => {
  let nueva = document.getElementById("password").value;
  let confirmar = document.getElementById("confirmPassword").value;
  let token = document.getElementById("token").textContent;

  const user = { nueva, confirmar, token };
  console.log(user);

  const response = await fetch("/api/users/nuevaPassord/nueva", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(user),
  }).then((result) => {
    if (result.status === 403) {
      result.json().then((json) => {
        alert("¡Alerta! La contraseña ya fue utilizada en el pasado.");
        location.reload();
      });
    } else if (result.status === 201) {
      alert("contraseña es válida, puedes continuar");
      location.href = "/users/login";
    }
  });
};

document.getElementById("btn-actualizarPassword").onclick = actualizarPassword;
