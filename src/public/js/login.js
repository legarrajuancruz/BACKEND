/*==========================
-           LOGIN           -
===========================*/

const loginUser = async () => {
  let user = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  const usuario = { user, pass };

  const response = await fetch("/api/sessions/login", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(usuario),
  });
  const data = await response.json();
  console.log(data);
  if (data.status === "OK") {
    location.href = "/products";
  }
};

document.getElementById("btnLogin").onclick = loginUser;
