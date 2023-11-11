/*==========================
-        REGISTER           -
===========================*/

const cambiarPassword = async () => {
  let email = document.getElementById("email").value;

  const user = { email };

  console.log(user);

  const response = await fetch("/api/users/cambiarPassword", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (data) {
    location.href = "/users/login";
  }
};

document.getElementById("btn-cambiarPassword").onclick = cambiarPassword;
