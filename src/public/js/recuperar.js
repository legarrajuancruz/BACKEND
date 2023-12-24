/*==========================
-        RECUPERAR          -
===========================*/

const cambiarPassword = async () => {
  let userMail = document.getElementById("email").value;

  const enviarEmail = { email: userMail };

  console.log("ESTAS ACA");
  console.log(enviarEmail);

  await fetch("/api/users/resetPassword", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(enviarEmail),
  }).then((result) => {
    if (result.status === 201) {
      alert("Email Enviado con exito");
      location.href = "/users/login";
    }
  });
};

document.getElementById("btn-cambiarPassword").onclick = cambiarPassword;
