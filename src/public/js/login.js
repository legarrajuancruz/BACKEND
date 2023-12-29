/*==========================
-           LOGIN           -
===========================*/

const loginUser = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const usuario = { email, password };

  const response = await fetch("/api/jwt/login", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(usuario),
  }).then((result) => {
    if (result.status === 200) {
      result.json().then((json) => {
        location.href = "/users/";
      });
    } else if (result.status === 401) {
      console.log(result);
      alert("Login invalido, controla tus credenciales");
    }
  });
};

document.getElementById("btnLogin").onclick = loginUser;
