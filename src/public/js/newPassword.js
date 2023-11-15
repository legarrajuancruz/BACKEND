/*=======================
-     NEW PASSWORD      -
=======================*/

const actualizarPassword = async () => {
  let nueva = document.getElementById("password").value;
  let confirmar = document.getElementById("confirmPassword").value;
  let token = document.getElementById("token").textContent;

  const user = { nueva, confirmar, token };

  console.log(user);

  const response = await fetch("/api/users/nuevaPassord", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => {
      if (true) {
        alert("¡Alerta! La contraseña ya fue utilizada en el pasado.");
        location.reload();
      } else {
        alert("contraseña es válida, puedes continuar");
        location.href = "/users/login";
      }
    });
};
document.getElementById("btn-actualizarPassword").onclick = actualizarPassword;
