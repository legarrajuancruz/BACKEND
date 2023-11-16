/*==========================
-        RECUPERAR          -
===========================*/

const cambiarPassword = async () => {
  let email = document.getElementById("email").value;

  const user = { email };

  console.log(user);

  const response = await fetch("/api/users/cambiarPassword", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(user),
  }).then((result) => {
    if (result.status === 401) {
      result.json().then((json) => {
        alert("¡Alerta! No ingresaste correo electornico.");
        location.reload();
      });
    } else if (result.status === 201) {
      alert("Email Enviado con exito");
      location.href = "/users/login";
    }
  });
};

document.getElementById("btn-cambiarPassword").onclick = cambiarPassword;
