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
    if (result.status === 200) {
      result.json().then((json) => {
        alert("correo enviado");
        location.href = "/users/login";
      });
    } else if (result.status === 401) {
      console.log(result);
      alert("Debes poner un email");
    }
  });
};

document.getElementById("btn-cambiarPassword").onclick = cambiarPassword;