/*==========================
-        RECUPERAR          -
===========================*/

const cambiarPassword = async () => {
  let email = document.getElementById("email").value;
  email.toString();

  const user = { email };
  console.log("ESTAS ACA");
  console.log(user);

  const response = await fetch("/api/users/cambiarPassword", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(user),
  }).then((result) => {
    if (result.status === 201) {
      alert("Email Enviado con exito");
      location.href = "/users/login";
    }
  });
};

document.getElementById("btn-cambiarPassword").onclick = cambiarPassword;
